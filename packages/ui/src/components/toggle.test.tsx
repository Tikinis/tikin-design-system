import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { compile } from "tailwindcss";
import { SwitchField, Toggle, type SwitchFieldProps, type ToggleProps } from "./toggle";

/* Radix mide el control con ResizeObserver para dimensionar el input espejo que
 * hace viajar el valor en un <form>. jsdom no lo implementa. El stub va aqui y
 * no en el setup compartido para no pisar a otros componentes; por eso comprueba
 * antes si ya existe. */
beforeAll(() => {
  if (!("ResizeObserver" in globalThis)) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
});

/* Tests de COMPORTAMIENTO, no de apariencia. Las medidas (42x24, recorrido 18,
 * el rebote del thumb) se verifican contra el navegador: jsdom no aplica CSS,
 * asi que comprobar clases aqui seria tautologico. */

describe("Toggle", () => {
  it("expone role=switch con aria-checked, no un checkbox", () => {
    // El rol importa: un lector de pantalla anuncia "activado/desactivado" en
    // vez de "marcado/desmarcado", que es lo que corresponde a un interruptor.
    render(<Toggle aria-label="Notificaciones" />);
    const sw = screen.getByRole("switch", { name: "Notificaciones" });
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("aplica el cambio al instante con un click, sin confirmar", async () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Notificaciones" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");

    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute("aria-checked", "true");

    await userEvent.click(sw);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("se alcanza con Tab y se acciona con Espacio y con Enter", async () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Notificaciones" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");

    await userEvent.tab();
    expect(sw).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    // Enter no lo da HTML por si solo en un <button> con role=switch: lo aporta
    // Radix. Si algun dia se sustituye la primitiva, este test lo delata.
    await userEvent.keyboard("{Enter}");
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("funciona controlado: sin onCheckedChange que actualice, no cambia solo", async () => {
    render(<Toggle aria-label="Notificaciones" checked={false} />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("respeta defaultChecked como estado inicial no controlado", () => {
    render(<Toggle aria-label="Notificaciones" defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("deshabilitado no reacciona ni al raton ni al teclado", async () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Notificaciones" disabled onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch");

    expect(sw).toBeDisabled();
    await userEvent.click(sw);
    await userEvent.keyboard(" ");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("con name publica su valor en el formulario que lo contiene", async () => {
    // Radix monta un input espejo. Sin el, un toggle dentro de un <form> nativo
    // no enviaria nada, porque un <button> no aporta valor al FormData.
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      expect(data.get("push")).toBe("on");
    });
    render(
      <form onSubmit={onSubmit}>
        <Toggle aria-label="Push" name="push" defaultChecked />
        <button type="submit">Guardar</button>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Toggle aria-label="X" className="rounded-none" />);
    // tailwind-merge debe descartar el rounded-pill de la base, no acumularlo.
    const cls = screen.getByRole("switch").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-full");
  });

  it("expone el ref del elemento interactivo", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Toggle aria-label="X" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("switch"));
  });

  it("no admite asChild ni en Toggle ni en SwitchField", () => {
    /* Test de TIPOS, no de runtime: quien lo comprueba es `tsc --noEmit`, no
       vitest. Si `asChild` volviera a colarse, la asignacion dejaria de ser un
       error, el `@ts-expect-error` sobraria y la compilacion fallaria.

       Hace falta por dos motivos. Uno, el sintoma en runtime es mudo: Radix
       sustituiria la raiz por el thumb y el interruptor quedaria inerte, sin
       aviso. Y dos, la defensa es menos obvia de lo que parece — las props de
       Switch.Root traen firma de indice, asi que un `Omit<…, "asChild">` a
       secas NO cierra nada y hace falta ademas `asChild?: never`. Este test es
       lo unico que impide "simplificar" el tipo y reabrir el agujero. */
    // @ts-expect-error asChild no forma parte de la API publica de Toggle
    const deToggle: ToggleProps = { asChild: true };
    // @ts-expect-error SwitchFieldProps hereda la exclusion de ToggleProps
    const deSwitchField: SwitchFieldProps = { title: "X", asChild: true };
    expect([deToggle, deSwitchField]).toHaveLength(2);
  });
});

describe("SwitchField", () => {
  it("toma su nombre accesible del titulo y su descripcion de la segunda linea", () => {
    render(
      <SwitchField title="Notificaciones push" description="Avisos de movimientos y envios" />,
    );
    const sw = screen.getByRole("switch", { name: "Notificaciones push" });
    expect(sw).toHaveAccessibleDescription("Avisos de movimientos y envios");
  });

  it("sin descripcion no deja un aria-describedby colgando", () => {
    render(<SwitchField title="Notificaciones push" />);
    // Apuntar a un id que no existe deja al lector de pantalla sin nada que
    // anunciar y ensucia las auditorias de a11y.
    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-describedby");
  });

  it("no pone el titulo en mayusculas en JS", () => {
    // Igual que en Button: el texto accesible y lo que se copia al portapapeles
    // deben conservar la capitalizacion original.
    render(<SwitchField title="Notificaciones push" />);
    expect(screen.getByText("Notificaciones push")).toBeInTheDocument();
  });

  it("se acciona con teclado igual que el Toggle suelto", async () => {
    const onCheckedChange = vi.fn();
    render(<SwitchField title="Notificaciones push" onCheckedChange={onCheckedChange} />);
    await userEvent.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("dos filas sin id explicito no colisionan entre si", () => {
    render(
      <>
        <SwitchField title="Primera" description="Uno" />
        <SwitchField title="Segunda" description="Dos" />
      </>,
    );
    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(2);
    const [a, b] = switches as [HTMLElement, HTMLElement];
    expect(a).toHaveAccessibleName("Primera");
    expect(b).toHaveAccessibleName("Segunda");
    expect(a.getAttribute("aria-labelledby")).not.toBe(b.getAttribute("aria-labelledby"));
  });

  it("con id explicito lo usa para el control, no para el contenedor", () => {
    render(<SwitchField id="push" title="Notificaciones push" />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("id", "push");
    expect(sw).toHaveAttribute("aria-labelledby", "push-title");
  });

  it("deshabilitado bloquea toda la fila", async () => {
    const onCheckedChange = vi.fn();
    render(<SwitchField title="Notificaciones push" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------------- */
/* CASCADA DE COLOR
 *
 * Excepcion consciente a la regla de "solo comportamiento" de este fichero. El
 * conflicto entre `data-[state=checked]` y `data-[disabled]` NO se ve mirando
 * las clases del elemento (las dos estan presentes y las dos son correctas por
 * separado): se decide en la cascada CSS, y jsdom no compila Tailwind. Por eso
 * estos tests compilan de verdad las utilidades del componente y calculan que
 * declaracion gana, igual que haria el navegador. Un test de clases seria
 * tautologico y no habria detectado el fallo.
 */

/** Divide la hoja en reglas de primer nivel. Las anidadas dentro de @media /
 *  @supports se ignoran a proposito: aqui solo interesan los colores, que
 *  Tailwind emite siempre en el nivel raiz. */
function reglasDePrimerNivel(css: string): { selector: string; cuerpo: string }[] {
  const reglas: { selector: string; cuerpo: string }[] = [];
  let profundidad = 0;
  let inicioSelector = 0;
  let inicioCuerpo = 0;
  let selector = "";

  for (let i = 0; i < css.length; i++) {
    if (css[i] === "{") {
      if (profundidad === 0) {
        selector = css.slice(inicioSelector, i).trim();
        inicioCuerpo = i + 1;
      }
      profundidad++;
    } else if (css[i] === "}") {
      profundidad--;
      if (profundidad === 0) {
        // Las at-rules (@media, @property, @layer) no son selectores.
        if (!selector.startsWith("@")) {
          reglas.push({ selector, cuerpo: css.slice(inicioCuerpo, i) });
        }
        inicioSelector = i + 1;
      }
    }
  }
  return reglas;
}

/** Especificidad (a,b,c) empaquetada en un solo numero comparable.
 *
 *  Las clases de Tailwind llegan escapadas — `.data-\[state\=checked\]\:bg-…` —
 *  y sus `\[` fingirian ser selectores de atributo. Se neutraliza cada pareja
 *  barra+caracter antes de contar. `:not()` no suma por si mismo pero si suma su
 *  argumento, que ya se cuenta al recorrer el resto del selector. */
function especificidad(selector: string): number {
  const limpio = selector
    .replace(/\\./g, "x") // escapes de Tailwind fuera
    .replace(/::[\w-]+/g, "") // los pseudo-elementos cuentan como elemento
    .replace(/:where\([^)]*\)/g, "") // :where() vale cero
    .replace(/:(?:not|is|has)\(/g, "("); // el prefijo no suma; su argumento si

  const ids = (limpio.match(/#[\w-]+/g) ?? []).length;
  const clases =
    (limpio.match(/\.[\w-]+/g) ?? []).length +
    (limpio.match(/\[/g) ?? []).length +
    (limpio.match(/:[\w-]+/g) ?? []).length;
  return ids * 10_000 + clases * 100;
}

/** Valor que el navegador acabaria pintando para `propiedad` en `el`: entre las
 *  reglas que casan, gana la mas especifica y, a igualdad, la ultima emitida. */
function valorGanador(el: Element, css: string, propiedad: string): string | undefined {
  const patron = new RegExp(`(?:^|;)\\s*${propiedad}\\s*:\\s*([^;]+)`);
  let ganador: string | undefined;
  let pesoGanador = -1;

  reglasDePrimerNivel(css).forEach(({ selector, cuerpo }, orden) => {
    const declaracion = patron.exec(cuerpo);
    if (!declaracion || !el.matches(selector)) return;
    // orden como desempate: crece siempre, y nunca alcanza un salto de
    // especificidad (100) con las pocas decenas de reglas de un componente.
    const peso = especificidad(selector) + orden;
    if (peso >= pesoGanador) {
      pesoGanador = peso;
      ganador = declaracion[1]?.trim();
    }
  });
  return ganador;
}

/** Escala inyectada al compilar las medidas. Tailwind NO emite las utilidades de
 *  tamaño ni de inset si no conoce `--spacing`, y aqui no hay cascada de tokens
 *  que la aporte. Coincide con la real (packages/tokens/src/theme.css), pero no
 *  hace falta que coincida: las comprobaciones que la usan son relativas —
 *  comparan el area pulsable contra el alto del propio track — y no clavan
 *  pixeles sueltos. */
const SPACING_PX = 4;

/** Pasa a pixeles lo que Tailwind emite para una medida: `0px`, `24px` o
 *  `calc(var(--spacing) * N)`. */
function aPixeles(valor: string): number {
  const enUnidades = /var\(--spacing\)\s*\*\s*(-?[\d.]+)/.exec(valor);
  if (enUnidades) return Number(enUnidades[1]) * SPACING_PX;
  const enPx = /(-?[\d.]+)px/.exec(valor);
  return enPx ? Number(enPx[1]) : Number.NaN;
}

/** Inset vertical del `::after` que agranda el area tactil, resuelto desde el
 *  CSS compilado. Negativo = el area pulsable sobresale del track por cada lado.
 *  Es lo mismo que hace `valorGanador`, pero recortando el `::after` del
 *  selector antes de casarlo: el pseudo-elemento no existe en jsdom. */
function insetVerticalDelAreaTactil(track: Element, css: string): number {
  let ganador = Number.NaN;
  let pesoGanador = -1;

  reglasDePrimerNivel(css).forEach(({ selector, cuerpo }, orden) => {
    if (!selector.endsWith("::after")) return;
    const declaracion = /(?:^|;)\s*inset-block\s*:\s*([^;]+)/.exec(cuerpo);
    if (!declaracion) return;
    if (!track.matches(selector.slice(0, -"::after".length))) return;
    const peso = especificidad(selector) + orden;
    if (peso >= pesoGanador) {
      pesoGanador = peso;
      ganador = aPixeles(declaracion[1]!.trim());
    }
  });
  return ganador;
}

async function cssDe(...elementos: Element[]): Promise<string> {
  const compilador = await compile("@tailwind utilities;", { base: process.cwd() });
  return compilador.build(elementos.flatMap((el) => [...el.classList]));
}

/** Como `cssDe`, pero declarando la escala. Solo lo necesitan las medidas: los
 *  colores del componente van en valores arbitrarios y se emiten sin tema. */
async function cssConEscalaDe(...elementos: Element[]): Promise<string> {
  const compilador = await compile(`@theme { --spacing: ${SPACING_PX}px; }\n@tailwind utilities;`, {
    base: process.cwd(),
  });
  return compilador.build(elementos.flatMap((el) => [...el.classList]));
}

/** Alto visible del track y alto de su zona pulsable, resueltos desde el CSS
 *  compilado del propio elemento. */
async function medirAreaTactil(track: Element) {
  const css = await cssConEscalaDe(track);
  const alto = aPixeles(valorGanador(track, css, "height") ?? "");
  const inset = insetVerticalDelAreaTactil(track, css);
  // inset negativo = el ::after sobresale; de ahi el signo de la suma.
  return { alto, pulsable: alto - 2 * inset };
}

describe("Toggle · cascada de color", () => {
  it("deshabilitado Y encendido se pinta con los tokens de deshabilitado, no con los de ON", async () => {
    // El caso que se colaba: ambas variantes casan con la misma especificidad y
    // Tailwind ordena `data-[disabled]` antes que `data-[state=checked]`, asi
    // que sin proteccion explicita ganaba el ON y el toggle parecia activo.
    render(<Toggle aria-label="Notificaciones" disabled defaultChecked />);
    const track = screen.getByRole("switch");
    const thumb = track.firstElementChild as HTMLElement;
    const css = await cssDe(track, thumb);

    expect(valorGanador(track, css, "background-color")).toBe("var(--toggle-track-bg-disabled)");
    // El borde viaja dentro de --tw-shadow; box-shadow solo compone las capas.
    expect(valorGanador(track, css, "--tw-shadow")).toContain("--toggle-track-stroke-disabled");
    expect(valorGanador(thumb, css, "background-color")).toBe("var(--toggle-thumb-bg-disabled)");
  });

  it("deshabilitado y encendido se pinta igual que deshabilitado y apagado", async () => {
    render(
      <>
        <Toggle aria-label="Apagado" disabled />
        <Toggle aria-label="Encendido" disabled defaultChecked />
      </>,
    );
    const apagado = screen.getByRole("switch", { name: "Apagado" });
    const encendido = screen.getByRole("switch", { name: "Encendido" });
    const css = await cssDe(apagado, encendido);

    expect(valorGanador(encendido, css, "background-color")).toBe(
      valorGanador(apagado, css, "background-color"),
    );
  });

  it("aun deshabilitado, el thumb sigue desplazado a la derecha cuando esta encendido", async () => {
    // La posicion es lo unico que distingue ON de OFF cuando el color ya no lo
    // hace: apagar tambien el recorrido dejaria el estado ilegible.
    render(<Toggle aria-label="Notificaciones" disabled defaultChecked />);
    const thumb = screen.getByRole("switch").firstElementChild as HTMLElement;
    const css = await cssDe(thumb);
    expect(valorGanador(thumb, css, "--tw-translate-x")).toBe("var(--tk-toggle-travel)");
  });

  it("habilitado y encendido conserva los tokens de ON", async () => {
    render(<Toggle aria-label="Notificaciones" defaultChecked />);
    const track = screen.getByRole("switch");
    const thumb = track.firstElementChild as HTMLElement;
    const css = await cssDe(track, thumb);

    expect(valorGanador(track, css, "background-color")).toBe("var(--toggle-track-bg-on)");
    expect(valorGanador(track, css, "--tw-shadow")).toContain("--toggle-track-stroke-on");
    expect(valorGanador(thumb, css, "background-color")).toBe("var(--toggle-thumb-bg-on)");
  });
});

describe("Toggle · area tactil", () => {
  /* El area pulsable es la unica medida del componente que NO es cosmetica:
     decide donde aterriza un click. Y tiene un techo tan real como su suelo,
     que es lo que se colaba. */

  it("los tres tamaños comparten un mismo alto pulsable: el del track L", async () => {
    /* Suelo: el minimo de area tactil son 24x24 CSS px y M (20) y S (16) no
       llegan solos, de ahi el pseudo-elemento.
       Techo: 24px es tambien lo que mide una fila de SwitchField sin
       descripcion —titulo `text-base`, line-height 24, igual que el track L—,
       asi que pasarse saca el area invisible de su propia fila. */
    const medidas = { l: 0, m: 0, s: 0 };
    for (const size of ["l", "m", "s"] as const) {
      const { unmount } = render(<Toggle aria-label="X" size={size} />);
      const medida = await medirAreaTactil(screen.getByRole("switch"));
      expect(medida.alto).not.toBeNaN();
      expect(medida.pulsable).not.toBeNaN();
      medidas[size] = medida.pulsable;
      if (size === "l") {
        // L ya mide el minimo: no debe ensancharse ni un pixel.
        expect(medida.pulsable).toBe(medida.alto);
      } else {
        // M y S si: su track se queda corto.
        expect(medida.alto).toBeLessThan(medidas.l);
      }
      unmount();
    }
    expect(medidas.m).toBe(medidas.l);
    expect(medidas.s).toBe(medidas.l);
  });

  it("en una lista con gap-3 el area de una fila no invade la vecina", async () => {
    /* Regresion del bug real: con un ensanche unico de 8px por lado el area
       sobresalia 8px por arriba y por abajo de una fila de 24px; dos filas
       contiguas separadas por `gap-3` (12px) se solapaban 4px y, sin z-index
       que las ordene, en esa banda gana la posterior en el DOM — pulsar el
       borde inferior de un interruptor conmutaba el de la fila de abajo.
       Se mide sobre la composicion real para que el test siga a SwitchField si
       algun dia cambia su tamaño por defecto. */
    const HUECO_ENTRE_FILAS = 12; // gap-3, tal como lo usa la story FilaDeAjuste
    const ALTO_DE_FILA = 24; // titulo sin descripcion

    render(
      <div className="flex flex-col gap-3">
        <SwitchField title="Primera" />
        <SwitchField title="Segunda" />
      </div>,
    );
    const filas = screen.getAllByRole("switch");
    const desbordes = await Promise.all(
      filas.map(async (track) => {
        const { pulsable } = await medirAreaTactil(track);
        return Math.max(0, (pulsable - ALTO_DE_FILA) / 2);
      }),
    );

    expect(desbordes).toHaveLength(2);
    expect(desbordes[0]! + desbordes[1]!).toBeLessThanOrEqual(HUECO_ENTRE_FILAS);
  });
});

describe("Toggle · sobreescritura por className", () => {
  it("el consumidor puede repintar el estado encendido", async () => {
    /* El desempate entre encendido y deshabilitado se resuelve subiendo el peso
       de DESHABILITADO, no bajando el de encendido. Si se hiciera al reves —con
       un `not-data-[disabled]` sobre el encendido— este test fallaria: el
       interno pasaria a (0,3,0), el del consumidor se quedaria en (0,2,0) y
       tailwind-merge tampoco veria el conflicto, porque el juego de
       modificadores ya no coincidiria. */
    render(
      <Toggle
        aria-label="Notificaciones"
        defaultChecked
        className="data-[state=checked]:bg-[rgb(255,0,0)]"
      />,
    );
    const track = screen.getByRole("switch");
    const css = await cssDe(track);
    expect(valorGanador(track, css, "background-color")).toBe("rgb(255,0,0)");
  });

  it("repintar el encendido no reabre el bug del deshabilitado", async () => {
    // La sobreescritura del consumidor sigue pesando (0,2,0), asi que el
    // deshabilitado duplicado (0,3,0) la sigue ganando.
    render(
      <Toggle
        aria-label="Notificaciones"
        defaultChecked
        disabled
        className="data-[state=checked]:bg-[rgb(255,0,0)]"
      />,
    );
    const track = screen.getByRole("switch");
    const css = await cssDe(track);
    expect(valorGanador(track, css, "background-color")).toBe("var(--toggle-track-bg-disabled)");
  });
});
