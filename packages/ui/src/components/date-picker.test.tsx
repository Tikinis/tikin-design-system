import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker, type DateRange } from "./date-picker";

/* Tests de COMPORTAMIENTO. Las medidas del documento (celda 34 r999, panel r16
 * con padding 18, banda lima) se verifican contra el navegador: jsdom no aplica
 * CSS, asi que comprobar clases aqui seria tautologico.
 *
 * Todo se ancla al 9 de julio de 2026 — el mismo dia que el prototipo marca
 * como "hoy" — inyectandolo por la prop `today`. Sin eso los tests caducarian
 * en cuanto cambiara el mes real. */

const HOY = new Date(2026, 6, 9);

beforeAll(() => {
  // Radix Popper mide disparador y panel con ResizeObserver, que jsdom no trae.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

/* Antes de abrir solo hay un boton en el documento — el disparador — asi que
 * no hace falta nombrarlo, y el nombre cambia con el valor elegido. */
async function abrir() {
  await userEvent.click(screen.getByRole("button"));
  return screen.findByRole("grid");
}

/* Los dias se buscan por su fecha ISO y no por rol + nombre, a proposito:
 * el nombre accesible lo compone Intl ("jueves, 9 de julio de 2026") y su
 * formato exacto depende de la version de ICU del runtime, mientras que el
 * numero visible se repite — un 1 puede ser de este mes y del siguiente. */
function dia(rejilla: HTMLElement, iso: string): HTMLButtonElement {
  const celda = rejilla.querySelector<HTMLButtonElement>(`[data-tk-dia="${iso}"]`);
  if (!celda) throw new Error(`El calendario no muestra el dia ${iso}`);
  return celda;
}

describe("DatePicker", () => {
  it("no monta el panel hasta que se abre el disparador", async () => {
    render(<DatePicker today={HOY} />);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();

    await abrir();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("abre en el mes de hoy cuando no hay valor", async () => {
    render(<DatePicker today={HOY} />);
    const rejilla = await abrir();
    expect(rejilla).toHaveAccessibleName(/julio 2026/i);
  });

  it("abre en el mes del valor, no en el de hoy", async () => {
    render(<DatePicker today={HOY} defaultValue={new Date(2026, 10, 3)} />);
    const rejilla = await abrir();
    expect(rejilla).toHaveAccessibleName(/noviembre 2026/i);
  });

  it("marca hoy con aria-current y el dia elegido con aria-selected", async () => {
    render(<DatePicker today={HOY} defaultValue={new Date(2026, 6, 20)} />);
    const rejilla = await abrir();

    expect(dia(rejilla, "2026-07-09")).toHaveAttribute("aria-current", "date");
    // aria-selected vive en la celda, que es quien tiene rol de gridcell.
    expect(dia(rejilla, "2026-07-20").closest("td")).toHaveAttribute("aria-selected", "true");
    /* Y SOLO en esa: con aria-selected="false" en las 35 celdas el lector
       anuncia "no seleccionado" en cada dia que se recorre con las flechas. */
    expect(dia(rejilla, "2026-07-09").closest("td")).not.toHaveAttribute("aria-selected");
  });

  it("en modo simple elige la fecha, la emite y cierra", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker today={HOY} onValueChange={onValueChange} />);
    const rejilla = await abrir();

    await userEvent.click(dia(rejilla, "2026-07-12"));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const elegido = onValueChange.mock.calls[0]![0] as Date;
    expect(elegido.getFullYear()).toBe(2026);
    expect(elegido.getMonth()).toBe(6);
    expect(elegido.getDate()).toBe(12);
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
  });

  it("no pone la fecha del disparador en mayusculas en JS, solo por CSS", async () => {
    // Importa para el texto accesible y para lo que se copia al portapapeles.
    render(<DatePicker today={HOY} defaultValue={new Date(2026, 6, 8)} />);
    expect(screen.getByRole("button")).toHaveTextContent("8 jul");
  });

  it("cambia de mes con las flechas de la cabecera", async () => {
    render(<DatePicker today={HOY} />);
    const rejilla = await abrir();

    await userEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));
    expect(rejilla).toHaveAccessibleName(/agosto 2026/i);

    await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    expect(rejilla).toHaveAccessibleName(/junio 2026/i);
  });

  it("mueve el foco con las flechas y elige con Intro", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker today={HOY} onValueChange={onValueChange} />);
    const rejilla = await abrir();

    // Al abrir, el foco cae sobre hoy y no sobre la primera flecha.
    await waitFor(() => expect(dia(rejilla, "2026-07-09")).toHaveFocus());

    await userEvent.keyboard("{ArrowRight}");
    expect(dia(rejilla, "2026-07-10")).toHaveFocus();

    // Abajo = una semana entera, no un dia.
    await userEvent.keyboard("{ArrowDown}");
    expect(dia(rejilla, "2026-07-17")).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect((onValueChange.mock.calls[0]![0] as Date).getDate()).toBe(17);
  });

  it("cruzar el borde del mes con las flechas cambia el mes visible", async () => {
    render(<DatePicker today={new Date(2026, 6, 31)} />);
    const rejilla = await abrir();
    await waitFor(() => expect(dia(rejilla, "2026-07-31")).toHaveFocus());

    await userEvent.keyboard("{ArrowRight}");
    expect(rejilla).toHaveAccessibleName(/agosto 2026/i);
    expect(dia(rejilla, "2026-08-01")).toHaveFocus();
  });

  it("RePag y AvPag saltan de mes conservando el foco", async () => {
    render(<DatePicker today={HOY} />);
    const rejilla = await abrir();
    await waitFor(() => expect(dia(rejilla, "2026-07-09")).toHaveFocus());

    await userEvent.keyboard("{PageDown}");
    expect(rejilla).toHaveAccessibleName(/agosto 2026/i);
    // Mismo dia del mes, no el mismo dia del calendario.
    expect(dia(rejilla, "2026-08-09")).toHaveFocus();

    await userEvent.keyboard("{PageUp}{PageUp}");
    expect(rejilla).toHaveAccessibleName(/junio 2026/i);
  });

  it("Inicio y Fin van a los extremos de la semana", async () => {
    // Con weekStartsOn=1 la semana del jueves 9 va del lunes 6 al domingo 12.
    render(<DatePicker today={HOY} />);
    const rejilla = await abrir();
    await waitFor(() => expect(dia(rejilla, "2026-07-09")).toHaveFocus());

    await userEvent.keyboard("{Home}");
    expect(dia(rejilla, "2026-07-06")).toHaveFocus();

    await userEvent.keyboard("{End}");
    expect(dia(rejilla, "2026-07-12")).toHaveFocus();
  });

  it("en modo rango el primer clic es el inicio y el segundo el fin", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker mode="range" today={HOY} onValueChange={onValueChange} />);
    const rejilla = await abrir();

    await userEvent.click(dia(rejilla, "2026-07-08"));
    // El rango incompleto tambien se emite: el consumidor pinta el progreso.
    let emitido = onValueChange.mock.calls[0]![0] as DateRange;
    expect(emitido.from.getDate()).toBe(8);
    expect(emitido.to).toBeNull();
    expect(screen.getByRole("grid")).toBeInTheDocument();

    await userEvent.click(dia(rejilla, "2026-07-15"));
    emitido = onValueChange.mock.calls[1]![0] as DateRange;
    expect(emitido.from.getDate()).toBe(8);
    expect(emitido.to?.getDate()).toBe(15);
    // Solo se cierra cuando el rango esta completo.
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
  });

  it("si el segundo clic es anterior al inicio, reinicia el inicio", async () => {
    // Regla literal del documento, no un descarte silencioso del clic.
    const onValueChange = vi.fn();
    render(<DatePicker mode="range" today={HOY} onValueChange={onValueChange} />);
    const rejilla = await abrir();

    await userEvent.click(dia(rejilla, "2026-07-15"));
    await userEvent.click(dia(rejilla, "2026-07-08"));

    const emitido = onValueChange.mock.calls[1]![0] as DateRange;
    expect(emitido.from.getDate()).toBe(8);
    expect(emitido.to).toBeNull();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("un rango ya completo se reinicia al volver a tocar un dia", async () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        mode="range"
        today={HOY}
        defaultValue={{ from: new Date(2026, 6, 8), to: new Date(2026, 6, 15) }}
        onValueChange={onValueChange}
      />,
    );
    const rejilla = await abrir();

    await userEvent.click(dia(rejilla, "2026-07-20"));
    const emitido = onValueChange.mock.calls[0]![0] as DateRange;
    expect(emitido.from.getDate()).toBe(20);
    expect(emitido.to).toBeNull();
  });

  it("marca los dos extremos del rango como seleccionados", async () => {
    render(
      <DatePicker
        mode="range"
        today={HOY}
        defaultValue={{ from: new Date(2026, 6, 8), to: new Date(2026, 6, 10) }}
      />,
    );
    const rejilla = await abrir();

    expect(dia(rejilla, "2026-07-08").closest("td")).toHaveAttribute("aria-selected", "true");
    expect(dia(rejilla, "2026-07-10").closest("td")).toHaveAttribute("aria-selected", "true");
    // El dia interior queda en la banda, pero no es un extremo elegido.
    expect(dia(rejilla, "2026-07-09").closest("td")).not.toHaveAttribute("aria-selected");
  });

  it("con confirm no emite nada hasta pulsar la accion", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker today={HOY} confirm onValueChange={onValueChange} />);
    const rejilla = await abrir();

    await userEvent.click(dia(rejilla, "2026-07-12"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("grid")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /confirmar/i }));
    expect((onValueChange.mock.calls[0]![0] as Date).getDate()).toBe(12);
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
  });

  it("con confirm, el disparador muestra el valor confirmado y no el borrador", async () => {
    /* El borrador es efimero: mientras el panel esta abierto puede tener una
       fecha que el usuario todavia no ha aceptado, y el disparador — que es lo
       que el resto de la pagina lee — no debe adelantarla. */
    const onValueChange = vi.fn();
    render(
      <DatePicker
        today={HOY}
        confirm
        defaultValue={new Date(2026, 6, 4)}
        onValueChange={onValueChange}
      />,
    );
    const disparador = screen.getByRole("button");
    const rejilla = await abrir();

    await userEvent.click(dia(rejilla, "2026-07-12"));
    expect(onValueChange).not.toHaveBeenCalled();
    // El panel si pinta el borrador: la accion inferior lo anuncia.
    expect(screen.getByRole("button", { name: /confirmar/i })).toHaveTextContent("12 jul");
    // El disparador sigue en el valor confirmado.
    expect(disparador).toHaveTextContent("4 jul");

    // Y al aceptar, el borrador pasa a ser el valor y el disparador lo refleja.
    await userEvent.click(screen.getByRole("button", { name: /confirmar/i }));
    expect((onValueChange.mock.calls[0]![0] as Date).getDate()).toBe(12);
    await waitFor(() => expect(disparador).toHaveTextContent("12 jul"));
  });

  it("con confirm, Escape descarta el borrador y no lo deja vivo al reabrir", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker today={HOY} confirm onValueChange={onValueChange} />);
    const disparador = screen.getByRole("button");
    const rejilla = await abrir();

    await userEvent.click(dia(rejilla, "2026-07-12"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());

    // Cerrar sin confirmar no emite nada, asi que el disparador tampoco cambia.
    expect(onValueChange).not.toHaveBeenCalled();
    expect(disparador).toHaveTextContent(/elegir fecha/i);

    // Y al reabrir el borrador descartado no puede seguir seleccionado.
    const reabierta = await abrir();
    expect(dia(reabierta, "2026-07-12").closest("td")).not.toHaveAttribute("aria-selected");
    expect(screen.getByRole("button", { name: /confirmar/i })).toBeDisabled();
  });

  it("la accion de confirmar esta apagada mientras no hay seleccion completa", async () => {
    render(<DatePicker mode="range" today={HOY} confirm />);
    const rejilla = await abrir();

    const accion = screen.getByRole("button", { name: /aplicar rango/i });
    expect(accion).toBeDisabled();

    await userEvent.click(dia(rejilla, "2026-07-08"));
    expect(accion).toBeDisabled();

    await userEvent.click(dia(rejilla, "2026-07-15"));
    expect(accion).toBeEnabled();
  });

  it("los dias fuera de minDate/maxDate no eligen pero siguen siendo enfocables", async () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        today={HOY}
        minDate={new Date(2026, 6, 10)}
        maxDate={new Date(2026, 6, 20)}
        onValueChange={onValueChange}
      />,
    );
    const rejilla = await abrir();

    const fuera = dia(rejilla, "2026-07-05");
    expect(fuera).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(fuera);
    expect(onValueChange).not.toHaveBeenCalled();

    /* Deliberadamente NO usa el atributo disabled: si lo usara, la navegacion
       por flechas se quedaria atascada al llegar al primer dia no elegible. */
    expect(fuera).not.toBeDisabled();
    fuera.focus();
    expect(fuera).toHaveFocus();
  });

  it("isDateDisabled veta dias sueltos", async () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        today={HOY}
        isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
        onValueChange={onValueChange}
      />,
    );
    const rejilla = await abrir();

    // 11 y 12 de julio de 2026 caen en sabado y domingo.
    await userEvent.click(dia(rejilla, "2026-07-11"));
    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.click(dia(rejilla, "2026-07-13"));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("apaga la flecha de mes cuando el mes vecino queda entero fuera de limites", async () => {
    render(
      <DatePicker today={HOY} minDate={new Date(2026, 6, 1)} maxDate={new Date(2026, 6, 31)} />,
    );
    const rejilla = await abrir();

    const previa = screen.getByRole("button", { name: "Mes anterior" });
    expect(previa).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Mes siguiente" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    /* Apagada con aria-disabled y no con el atributo `disabled`: un boton
       deshabilitado deja de ser enfocable, asi que al llegar navegando al mes
       de minDate la flecha se apagaria bajo el propio foco y este caeria al
       <body>, fuera de un panel que ademas es no modal por defecto. */
    await userEvent.click(previa);
    expect(rejilla).toHaveAccessibleName(/julio 2026/i);
    expect(previa).toHaveFocus();
  });

  it("los presets aplican su rango completo", async () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        mode="range"
        today={HOY}
        onValueChange={onValueChange}
        presets={[
          { label: "7 días", range: { from: new Date(2026, 6, 3), to: new Date(2026, 6, 9) } },
        ]}
      />,
    );
    await abrir();

    await userEvent.click(screen.getByRole("button", { name: "7 días" }));
    const emitido = onValueChange.mock.calls[0]![0] as DateRange;
    expect(emitido.from.getDate()).toBe(3);
    expect(emitido.to?.getDate()).toBe(9);
  });

  it("Escape cierra el panel y devuelve el foco al disparador", async () => {
    render(<DatePicker today={HOY} />);
    const disparador = screen.getByRole("button", { name: /elegir/i });
    await abrir();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
    expect(disparador).toHaveFocus();
  });

  it("respeta el valor controlado y no se lo inventa por su cuenta", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker today={HOY} value={new Date(2026, 6, 4)} onValueChange={onValueChange} />);
    const disparador = screen.getByRole("button");
    expect(disparador).toHaveTextContent("4 jul");

    await userEvent.click(disparador);
    const rejilla = await screen.findByRole("grid");
    await userEvent.click(dia(rejilla, "2026-07-12"));

    // El consumidor manda: sin cambiar la prop, el disparador no cambia.
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(disparador).toHaveTextContent("4 jul");
  });

  it("acepta un disparador propio sin anidar botones", async () => {
    render(
      <DatePicker today={HOY}>
        <button type="button">Fecha de envío</button>
      </DatePicker>,
    );
    const disparador = screen.getByRole("button", { name: "Fecha de envío" });
    expect(disparador).toHaveAttribute("aria-haspopup", "dialog");

    await userEvent.click(disparador);
    expect(await screen.findByRole("grid")).toBeInTheDocument();
  });

  it("permite sobreescribir estilos del disparador por className", () => {
    render(<DatePicker today={HOY} className="rounded-none" />);
    // tailwind-merge debe descartar el rounded-md del disparador, no acumularlo.
    const clases = screen.getByRole("button").className;
    expect(clases).toContain("rounded-none");
    expect(clases).not.toContain("rounded-md");
  });

  it("no abre cuando el disparador esta deshabilitado", async () => {
    render(<DatePicker today={HOY} disabled />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("tampoco abre con disparador propio cuando esta deshabilitado", async () => {
    /* El tipo del componente promete props de <button>, asi que `disabled`
       tiene que apagar tambien el disparador que pone el consumidor. */
    render(
      <DatePicker today={HOY} disabled>
        <button type="button">Fecha</button>
      </DatePicker>,
    );
    const disparador = screen.getByRole("button", { name: "Fecha" });
    expect(disparador).toBeDisabled();

    await userEvent.click(disparador);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("compone className y props sueltas sobre el disparador propio", async () => {
    render(
      <DatePicker today={HOY} className="w-full" id="campo-fecha" data-testid="disparador">
        <button type="button" className="border-dashed">
          Fecha
        </button>
      </DatePicker>,
    );
    const disparador = screen.getByTestId("disparador");
    expect(disparador).toHaveAttribute("id", "campo-fecha");
    expect(disparador.className).toContain("w-full");
    // Lo que declara el hijo no se pierde por componer: manda el consumidor.
    expect(disparador.className).toContain("border-dashed");

    // Y sigue siendo el disparador del popover.
    await userEvent.click(disparador);
    expect(await screen.findByRole("grid")).toBeInTheDocument();
  });

  it("pinta la banda del rango en la celda: extremos redondeados y centro plano", async () => {
    /* La banda es logica pura de `bandaDe` y se puede afirmar por clases sin
       depender de CSS. El redondeo de los extremos solo existe si la tabla NO
       va en border-collapse: por especificacion, una tabla colapsada ignora el
       border-radius de sus celdas y los extremos saldrian cuadrados. */
    render(
      <DatePicker
        mode="range"
        today={HOY}
        defaultValue={{ from: new Date(2026, 6, 8), to: new Date(2026, 6, 15) }}
      />,
    );
    const rejilla = await abrir();

    const celda = (iso: string) => dia(rejilla, iso).closest("td")!.className;
    expect(celda("2026-07-08")).toContain("rounded-l-");
    expect(celda("2026-07-11")).toContain("bg-lime");
    expect(celda("2026-07-11")).not.toContain("rounded-");
    expect(celda("2026-07-15")).toContain("rounded-r-");
    // Fuera del rango no hay banda.
    expect(celda("2026-07-16")).not.toContain("bg-lime");

    expect(rejilla.className).toContain("border-separate");
    expect(rejilla.className).not.toContain("border-collapse");
  });

  it("un extremo del rango fuera del mes visible no se queda en gris de fuera de mes", async () => {
    /* Variante y estado pintan los dos el color del texto. Sin resolver el
       conflicto por tailwind-merge, la celda emite `text-ink-400 text-surface`
       y quien gana depende del orden de la hoja compilada. */
    render(
      <DatePicker
        mode="range"
        today={HOY}
        defaultValue={{ from: new Date(2026, 5, 29), to: new Date(2026, 6, 3) }}
      />,
    );
    const rejilla = await abrir();
    // Se abre en junio, donde el 3 de julio es un dia de relleno y ademas fin.
    expect(rejilla).toHaveAccessibleName(/junio 2026/i);

    /* Se miran las clases sueltas: el gris tiene que desaparecer del color
       plano, pero seguir vivo bajo `aria-disabled:`, que es otro estado. */
    const fin = dia(rejilla, "2026-07-03");
    expect(fin.classList.contains("text-surface")).toBe(true);
    expect(fin.classList.contains("text-ink-400")).toBe(false);
    expect(fin.classList.contains("aria-disabled:text-ink-400")).toBe(true);

    // Y un interior de banda fuera de mes se queda en on-accent, no en gris.
    const interior = dia(rejilla, "2026-07-01");
    expect(interior.classList.contains("text-on-accent")).toBe(true);
    expect(interior.classList.contains("text-ink-400")).toBe(false);
  });

  it("weekStartsOn mueve la primera columna y con ella Inicio y Fin", async () => {
    render(<DatePicker today={HOY} weekStartsOn={0} />);
    const rejilla = await abrir();

    const cabeceras = rejilla.querySelectorAll("thead th");
    expect(cabeceras[0]).toHaveTextContent(/domingo/i);

    // Con la semana en domingo, la del jueves 9 va del domingo 5 al sabado 11.
    await waitFor(() => expect(dia(rejilla, "2026-07-09")).toHaveFocus());
    await userEvent.keyboard("{Home}");
    expect(dia(rejilla, "2026-07-05")).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(dia(rejilla, "2026-07-11")).toHaveFocus();
  });

  it("locale cambia los nombres de mes y de dia", async () => {
    render(<DatePicker today={HOY} locale="en-US" />);
    const rejilla = await abrir();

    expect(rejilla).toHaveAccessibleName(/july 2026/i);
    expect(rejilla.querySelectorAll("thead th")[0]).toHaveTextContent(/monday/i);
  });
});
