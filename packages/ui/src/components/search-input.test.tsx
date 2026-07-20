import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./search-input";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Que el campo mida 52, que
 * el borde pase a tinta al enfocar o que el circulo de limpiar mida 26 se
 * verifica contra el navegador: jsdom no aplica CSS, asi que comprobar clases
 * seria tautologico.
 *
 * Lo que si rompe de verdad — y es lo que se prueba aqui — es el cableado: que
 * el campo tenga nombre accesible, que la X aparezca y desaparezca cuando toca,
 * que limpiar avise a `onChange` como lo haria una pulsacion de tecla, que el
 * foco no se pierda y que Escape no se trague el evento cuando no lo usa. */

/**
 * Reproduce el contrato del DismissableLayer de Radix, que es lo que hay debajo
 * del Modal y del Popover de este mismo repo: escucha Escape sobre `document`
 * EN FASE DE CAPTURA — o sea antes de que el evento toque al <input> — y solo
 * se cierra si nadie ha marcado el evento con `preventDefault`.
 *
 * No se usa el Modal real a proposito: aqui lo que se prueba es exactamente ese
 * contrato, sin arrastrar el trampeo de foco ni el portal, que en jsdom añaden
 * ruido y no cambian el resultado.
 */
function CapaDescartable({
  onDismiss,
  children,
}: {
  onDismiss: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (event.defaultPrevented) return;
      event.preventDefault();
      onDismiss();
    };
    document.addEventListener("keydown", handler, { capture: true });
    return () => document.removeEventListener("keydown", handler, { capture: true });
  }, [onDismiss]);
  return <>{children}</>;
}

describe("SearchInput", () => {
  it("tiene nombre accesible aunque no se vea ninguna etiqueta", () => {
    // El placeholder NO es un nombre accesible: desaparece al escribir.
    render(<SearchInput />);
    expect(screen.getByLabelText("Buscar")).toHaveProperty("tagName", "INPUT");
  });

  it("acepta una etiqueta propia y la usa como nombre accesible", () => {
    render(<SearchInput label="Buscar contacto o movimiento" />);
    expect(
      screen.getByRole("searchbox", { name: "Buscar contacto o movimiento" }),
    ).toBeInTheDocument();
  });

  it("es un input[type=search], no un input de texto", () => {
    render(<SearchInput />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("type", "search");
  });

  it("avisa del texto ya actualizado en cada tecla", async () => {
    const onValueChange = vi.fn();
    render(<SearchInput onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("searchbox"), "Val");
    expect(onValueChange).toHaveBeenCalledTimes(3);
    expect(onValueChange).toHaveBeenLastCalledWith("Val");
  });

  it("la X de limpiar solo existe cuando hay texto", async () => {
    render(<SearchInput />);
    expect(screen.queryByRole("button", { name: "Limpiar" })).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole("searchbox"), "V");
    expect(screen.getByRole("button", { name: "Limpiar" })).toBeInTheDocument();
  });

  it("al limpiar vacia el campo, avisa por onChange y devuelve el foco", async () => {
    const vistos: string[] = [];
    const onChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) => {
      vistos.push(event.target.value);
    });
    const onClear = vi.fn();
    render(<SearchInput onChange={onChange} onClear={onClear} />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");

    await userEvent.type(input, "Valentina");
    vistos.length = 0;

    await userEvent.click(screen.getByRole("button", { name: "Limpiar" }));

    expect(input.value).toBe("");
    // El vaciado viaja por el setter nativo justo para que onChange se entere:
    // un `input.value = ""` a secas dejaria a React sin enterarse.
    expect(vistos).toEqual([""]);
    expect(onClear).toHaveBeenCalledTimes(1);
    // La X desaparece al vaciarse; si el foco se quedara en ella, acabaria en
    // el <body> y el usuario de teclado se perderia.
    expect(input).toHaveFocus();
  });

  it("la X no envia el formulario que la contiene", async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <SearchInput defaultValue="Valentina" />
      </form>,
    );
    // Un <button> sin type dentro de un <form> envia. Es el fallo clasico.
    await userEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("Escape limpia el campo sin sacar el foco", async () => {
    const onClear = vi.fn();
    render(<SearchInput defaultValue="Valentina" onClear={onClear} />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");

    input.focus();
    await userEvent.keyboard("{Escape}");

    expect(input.value).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
  });

  it("con texto, Escape no llega al ancestro de React que lo envuelve", async () => {
    const onEscapeArriba = vi.fn();
    render(
      <div onKeyDown={onEscapeArriba}>
        <SearchInput defaultValue="Valentina" />
      </div>,
    );
    screen.getByRole("searchbox").focus();

    // Con texto, el buscador se queda el evento: Escape significa "limpiar".
    await userEvent.keyboard("{Escape}");
    expect(onEscapeArriba).not.toHaveBeenCalled();
  });

  it("recien montado y vacio, Escape sube al ancestro desde la primera pulsacion", async () => {
    /* Montaje limpio, no un rerender: React ignora `defaultValue` en un
       componente ya montado, asi que reutilizar el del test anterior nunca
       ejercitaria el caso de un buscador que nace vacio. */
    const onEscapeArriba = vi.fn();
    render(
      <div onKeyDown={onEscapeArriba}>
        <SearchInput />
      </div>,
    );
    screen.getByRole("searchbox").focus();

    await userEvent.keyboard("{Escape}");
    expect(onEscapeArriba).toHaveBeenCalledTimes(1);
  });

  it("dentro de una capa que se cierra con Escape, la primera pulsacion solo limpia", async () => {
    const onDismiss = vi.fn();
    render(
      <CapaDescartable onDismiss={onDismiss}>
        <SearchInput defaultValue="Valentina" />
      </CapaDescartable>,
    );
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    input.focus();

    // Una sola pulsacion NO puede vaciar y cerrar a la vez.
    await userEvent.keyboard("{Escape}");
    expect(input.value).toBe("");
    expect(onDismiss).not.toHaveBeenCalled();

    // La segunda, ya con el campo vacio, si cierra la capa.
    await userEvent.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("readOnly no ofrece limpiar ni se vacia con Escape", async () => {
    const onClear = vi.fn();
    render(<SearchInput readOnly defaultValue="Valentina" onClear={onClear} />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");

    // El setter nativo que usa `clear` no respeta readOnly: si la X existiera,
    // un campo de solo lectura se podria vaciar.
    expect(screen.queryByRole("button", { name: "Limpiar" })).not.toBeInTheDocument();

    input.focus();
    await userEvent.keyboard("{Escape}");
    expect(input.value).toBe("Valentina");
    expect(onClear).not.toHaveBeenCalled();
  });

  it("en carga el aro ocupa el hueco de la lupa", () => {
    // El comportamiento nuclear del bloque LUPA + LIMPIAR: "en carga, la lupa se
    // reemplaza por un spinner". Se mira la estructura, no las clases: la lupa
    // es un <svg> y el aro no.
    const { rerender } = render(<SearchInput />);
    const hueco = () => screen.getByRole("searchbox").previousElementSibling as HTMLElement;

    expect(hueco().querySelector("svg")).not.toBeNull();

    rerender(<SearchInput loading />);
    expect(hueco().querySelector("svg")).toBeNull();
    // El hueco no se queda vacio: se reemplaza, no se borra.
    expect(hueco().firstElementChild).not.toBeNull();
  });

  it("con clearable={false} no pinta la X y Escape no limpia", async () => {
    render(<SearchInput clearable={false} defaultValue="Valentina" />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    expect(screen.queryByRole("button", { name: "Limpiar" })).not.toBeInTheDocument();

    input.focus();
    await userEvent.keyboard("{Escape}");
    expect(input.value).toBe("Valentina");
  });

  it("controlado: el valor lo manda el padre", async () => {
    function Controlado() {
      const [q, setQ] = React.useState("");
      return <SearchInput value={q} onValueChange={setQ} />;
    }
    render(<Controlado />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");

    await userEvent.type(input, "Val");
    expect(input.value).toBe("Val");

    await userEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(input.value).toBe("");
    expect(screen.queryByRole("button", { name: "Limpiar" })).not.toBeInTheDocument();
  });

  it("controlado: si el padre ignora el cambio, el campo no se mueve", async () => {
    render(<SearchInput value="Valentina" onValueChange={() => {}} />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    await userEvent.type(input, "x");
    // Un campo controlado que no recibe valor nuevo debe quedarse como estaba.
    expect(input.value).toBe("Valentina");
  });

  it("en carga anuncia el estado y sigue dejando escribir", async () => {
    const onValueChange = vi.fn();
    render(<SearchInput loading onValueChange={onValueChange} />);
    const input = screen.getByRole("searchbox");

    expect(input).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Buscando");

    // La carga no bloquea: el usuario puede seguir afinando la consulta.
    await userEvent.type(input, "a");
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("la region viva existe tambien en reposo, vacia", () => {
    // Se monta siempre a proposito: una live region que aparece ya con texto no
    // se anuncia en varios lectores de pantalla.
    render(<SearchInput />);
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("deshabilitado no deja escribir ni ofrece limpiar", async () => {
    const onValueChange = vi.fn();
    render(<SearchInput disabled defaultValue="Valentina" onValueChange={onValueChange} />);

    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Limpiar" })).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole("searchbox"), "x");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("permite sobreescribir estilos por className", () => {
    render(<SearchInput className="rounded-none" />);
    // className estiliza la CAJA, no el input: es lo que un consumidor entiende
    // por "el buscador".
    const box = screen.getByRole("searchbox").parentElement as HTMLElement;
    expect(box.className).toContain("rounded-none");
    // tailwind-merge debe descartar el rounded-lg de la base, no acumularlo.
    expect(box.className).not.toContain("rounded-lg");
  });

  it("la ref apunta al input real", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
