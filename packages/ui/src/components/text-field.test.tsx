import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField, Textarea } from "./text-field";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Que la etiqueta suba a
 * 11px al enfocar, que el borde pase a tinta o que el campo mida 56 px se
 * verifica contra el navegador: jsdom no aplica CSS ni resuelve
 * :placeholder-shown, asi que comprobar clases seria tautologico.
 *
 * Lo que si es comprobable aqui — y es lo que de verdad rompe — es el cableado
 * accesible: que la etiqueta nombre al input, que el mensaje llegue por
 * aria-describedby y que el contador cuente bien controlado y sin controlar. */

describe("TextField", () => {
  it("la etiqueta de dentro es el nombre accesible del input", () => {
    render(<TextField label="Correo electrónico" />);
    // Si esto falla, el campo es anonimo para un lector de pantalla aunque se
    // vea perfecto.
    expect(screen.getByLabelText("Correo electrónico")).toHaveProperty("tagName", "INPUT");
  });

  it("al hacer clic en la etiqueta enfoca el input", async () => {
    render(<TextField label="Contraseña" />);
    await userEvent.click(screen.getByText("Contraseña"));
    expect(screen.getByLabelText("Contraseña")).toHaveFocus();
  });

  it("pone un placeholder de un espacio cuando no se le da uno", () => {
    // No es cosmetico: :placeholder-shown es el interruptor CSS que decide si
    // la etiqueta descansa o flota. Sin atributo, la etiqueta se quedaria
    // arriba con el campo vacio.
    render(<TextField label="Correo" />);
    expect(screen.getByLabelText("Correo")).toHaveAttribute("placeholder", " ");
  });

  it("respeta el placeholder del consumidor cuando lo hay", () => {
    render(<TextField label="Monto" placeholder="0" />);
    expect(screen.getByLabelText("Monto")).toHaveAttribute("placeholder", "0");
  });

  it("no pone la etiqueta en mayusculas en JS", () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<TextField label="Nombre completo" />);
    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
  });

  it("escribir actualiza el valor y dispara onChange", async () => {
    const onChange = vi.fn();
    render(<TextField label="TikinTAG" onChange={onChange} />);
    const input = screen.getByLabelText("TikinTAG");
    await userEvent.type(input, "valentina");
    expect(input).toHaveValue("valentina");
    expect(onChange).toHaveBeenCalled();
  });

  it("en error marca aria-invalid y enlaza el mensaje por aria-describedby", () => {
    render(<TextField label="Correo" feedback="error" message="Ingresa un correo válido." />);
    const input = screen.getByLabelText("Correo");
    expect(input).toHaveAttribute("aria-invalid", "true");

    const messageId = input.getAttribute("aria-describedby");
    expect(messageId).toBeTruthy();
    expect(document.getElementById(messageId!)).toHaveTextContent("Ingresa un correo válido.");
  });

  it("sin feedback de error no marca aria-invalid pero sigue describiendo el mensaje", () => {
    render(<TextField label="TikinTAG" feedback="success" message="TikinTAG disponible." />);
    const input = screen.getByLabelText("TikinTAG");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("conserva el aria-describedby que pase el consumidor y le añade el suyo", () => {
    render(
      <>
        <span id="ayuda-externa">Usa tu correo de trabajo</span>
        <TextField label="Correo" message="Obligatorio" aria-describedby="ayuda-externa" />
      </>,
    );
    const described = screen.getByLabelText("Correo").getAttribute("aria-describedby") ?? "";
    expect(described.split(" ")).toContain("ayuda-externa");
    expect(described.split(" ")).toHaveLength(2);
  });

  it("sin mensaje ni contador no deja nodos vacios bajo el campo", () => {
    const { container } = render(<TextField label="Correo" />);
    expect(screen.getByLabelText("Correo")).not.toHaveAttribute("aria-describedby");
    // El bloque de mensaje/contador solo existe si hay algo que enseñar.
    expect(container.querySelectorAll("[aria-live]")).toHaveLength(0);
  });

  it("el contador cuenta sin control externo, partiendo del defaultValue", async () => {
    render(<TextField label="TikinTAG" maxLength={20} counter defaultValue="valentina" />);
    expect(screen.getByText("9 / 20")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("TikinTAG"), "22");
    expect(screen.getByText("11 / 20")).toBeInTheDocument();
  });

  it("el contador refleja el valor controlado, no un estado interno propio", () => {
    // Con el campo controlado el contador NO puede llevar cuenta aparte: si el
    // padre rechaza la tecla, el numero se quedaria mintiendo.
    const { rerender } = render(
      <TextField label="TikinTAG" maxLength={20} counter value="ana" onChange={() => {}} />,
    );
    expect(screen.getByText("3 / 20")).toBeInTheDocument();

    rerender(<TextField label="TikinTAG" maxLength={20} counter value="anita" onChange={() => {}} />);
    expect(screen.getByText("5 / 20")).toBeInTheDocument();
  });

  it("no muestra contador si no hay maxLength que contar contra", () => {
    render(<TextField label="TikinTAG" counter />);
    expect(screen.queryByText(/\s\/\s/)).not.toBeInTheDocument();
  });

  it("deshabilitado no admite escritura", async () => {
    const onChange = vi.fn();
    render(<TextField label="Correo" disabled onChange={onChange} />);
    const input = screen.getByLabelText("Correo");
    expect(input).toBeDisabled();
    await userEvent.type(input, "hola");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("en solo lectura sigue siendo enfocable y seleccionable, pero no editable", async () => {
    render(<TextField label="Correo" readOnly defaultValue="valentina@tikin.co" />);
    const input = screen.getByLabelText("Correo");
    expect(input).toHaveAttribute("readonly");
    // A diferencia de disabled, readOnly conserva el foco: el usuario tiene que
    // poder seleccionar el texto para copiarlo.
    expect(input).not.toBeDisabled();
    await userEvent.tab();
    expect(input).toHaveFocus();
    await userEvent.type(input, "X");
    expect(input).toHaveValue("valentina@tikin.co");
  });

  it("la accion final es alcanzable por teclado desde el input", async () => {
    const onClick = vi.fn();
    render(
      <TextField
        label="Contraseña"
        type="password"
        endAction={
          <button type="button" aria-label="Mostrar u ocultar" onClick={onClick}>
            ojo
          </button>
        }
      />,
    );
    screen.getByLabelText("Contraseña").focus();
    await userEvent.tab();
    const toggle = screen.getByRole("button", { name: "Mostrar u ocultar" });
    expect(toggle).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("los iconos decorativos quedan fuera del arbol accesible", () => {
    render(
      <TextField
        label="Buscar contacto"
        startIcon={<span data-testid="lupa">lupa</span>}
        endIcon={<span data-testid="check">check</span>}
      />,
    );
    // aria-hidden en el contenedor: un icono anunciado como "lupa" ensucia el
    // nombre del campo sin aportar nada.
    expect(screen.getByTestId("lupa").closest("[aria-hidden]")).not.toBeNull();
    expect(screen.getByTestId("check").closest("[aria-hidden]")).not.toBeNull();
  });

  it("expone la ref del input real, no del contenedor", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<TextField label="Correo" ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
  });

  it("permite sobreescribir estilos del control por className", () => {
    const { container } = render(<TextField label="Correo" className="rounded-none" />);
    // className estiliza la CAJA (wrapper > caja), no el contenedor externo.
    // tailwind-merge debe descartar el rounded-lg del tamaño, no acumularlo.
    const box = container.firstElementChild?.firstElementChild;
    expect(box?.className).toContain("rounded-none");
    expect(box?.className).not.toContain("rounded-lg");
  });

  it("dentro de un formulario envia su valor con el name dado", async () => {
    const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      expect(new FormData(e.currentTarget).get("tag")).toBe("valentina");
    });
    render(
      <form onSubmit={onSubmit}>
        <TextField label="TikinTAG" name="tag" defaultValue="valentina" />
        <button type="submit">Enviar</button>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("Textarea", () => {
  it("la etiqueta de arriba nombra al textarea", () => {
    render(<Textarea label="Nota para el destinatario" />);
    expect(screen.getByLabelText("Nota para el destinatario")).toHaveProperty(
      "tagName",
      "TEXTAREA",
    );
  });

  it("enlaza helper y mensaje a la vez por aria-describedby", () => {
    // A diferencia del TextField, aqui el helper SI convive con el mensaje: la
    // etiqueta esta fuera del campo y hay sitio para los dos.
    render(
      <Textarea
        label="Descripción del envío"
        helper="Lo verá quien reciba."
        message="Mínimo 10 caracteres."
        feedback="error"
      />,
    );
    const area = screen.getByLabelText("Descripción del envío");
    const described = (area.getAttribute("aria-describedby") ?? "").split(" ");
    expect(described).toHaveLength(2);
    expect(described.map((id) => document.getElementById(id)?.textContent)).toEqual([
      "Lo verá quien reciba.",
      "Mínimo 10 caracteres.",
    ]);
    expect(area).toHaveAttribute("aria-invalid", "true");
  });

  it("acepta saltos de linea, que es su razon de existir", async () => {
    render(<Textarea label="Motivo" />);
    const area = screen.getByLabelText("Motivo");
    await userEvent.type(area, "linea uno{Enter}linea dos");
    expect(area).toHaveValue("linea uno\nlinea dos");
  });

  it("el contador cuenta desde el defaultValue y sigue al teclear", async () => {
    render(<Textarea label="Nota" maxLength={300} counter defaultValue="Gracias por tu ayuda" />);
    expect(screen.getByText("20 / 300")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Nota"), "!");
    expect(screen.getByText("21 / 300")).toBeInTheDocument();
  });

  it("deshabilitado no admite escritura", async () => {
    const onChange = vi.fn();
    render(<Textarea label="Motivo" disabled onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Motivo"), "hola");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("expone la ref del textarea real", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea label="Motivo" ref={ref} />);
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });

  it("permite sobreescribir estilos por className", () => {
    render(<Textarea label="Motivo" className="rounded-none" />);
    const cls = screen.getByLabelText("Motivo").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-lg");
  });

  it("arranca con 3 filas, el alto que dibuja el documento", () => {
    render(<Textarea label="Motivo" />);
    expect(screen.getByLabelText("Motivo")).toHaveAttribute("rows", "3");
  });
});
