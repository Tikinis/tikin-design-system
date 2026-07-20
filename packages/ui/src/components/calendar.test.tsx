import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar, CalendarDay, getCalendarGrid } from "./calendar";

/* Estos tests cubren COMPORTAMIENTO, no apariencia. Los valores visuales
 * (32x32, r8, texto 14/20, halo de foco 3px) se verifican contra el navegador,
 * no aqui: jsdom no aplica CSS, asi que comprobar clases seria tautologico.
 *
 * Todo se ancla a julio de 2026 y los textos accesibles se inyectan con
 * `formatDay` / `formatMonthCaption`. Depender de lo que Intl devuelva para
 * es-ES ataria la suite a la version de ICU del Node que la ejecute. */

const JULIO_2026 = new Date(2026, 6, 1);
const HOY = new Date(2026, 6, 9);

/** "2026-07-15" — legible en el mensaje de error y estable en cualquier ICU. */
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function setup(props: Partial<React.ComponentProps<typeof Calendar>> = {}) {
  return render(
    <Calendar
      defaultMonth={JULIO_2026}
      today={HOY}
      formatDay={iso}
      formatMonthCaption={(month) => `${month.getMonth() + 1}/${month.getFullYear()}`}
      formatWeekday={(date) => String(date.getDay())}
      {...props}
    />,
  );
}

const day = (value: string) => screen.getByRole("button", { name: value });

describe("getCalendarGrid", () => {
  it("siempre devuelve seis semanas de siete dias", () => {
    // Febrero de 2027 empieza en lunes y tiene 28 dias: cabe en cuatro filas.
    // Aun asi se rellena a seis para que el alto no salte al cambiar de mes.
    for (const month of [new Date(2027, 1, 1), new Date(2026, 6, 1), new Date(2026, 7, 1)]) {
      const weeks = getCalendarGrid(month);
      expect(weeks).toHaveLength(6);
      expect(weeks.every((week) => week.length === 7)).toBe(true);
    }
  });

  it("respeta donde empieza la semana", () => {
    // 1 de julio de 2026 es miercoles. Con la semana en lunes, la rejilla
    // arranca el 29 de junio; con la semana en domingo, el 28.
    expect(iso(getCalendarGrid(JULIO_2026, 1)[0]![0]!)).toBe("2026-06-29");
    expect(iso(getCalendarGrid(JULIO_2026, 0)[0]![0]!)).toBe("2026-06-28");
  });

  it("no rompe en los cambios de hora", () => {
    // En Madrid el 29 de marzo de 2026 la noche dura 23 horas. Construyendo las
    // fechas por dia (y no sumando 24h) el dia ni se pierde ni se repite.
    const marzo = getCalendarGrid(new Date(2026, 2, 1)).flat().map(iso);
    expect(marzo).toContain("2026-03-29");
    expect(new Set(marzo).size).toBe(marzo.length);
  });
});

describe("Calendar", () => {
  it("pinta seis filas de dias mas la cabecera de columnas", () => {
    setup();
    expect(screen.getAllByRole("row")).toHaveLength(7);
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
  });

  it("marca hoy con aria-current y el dia elegido con aria-selected en su celda", () => {
    setup({ defaultSelected: new Date(2026, 6, 20) });

    expect(day("2026-07-09")).toHaveAttribute("aria-current", "date");
    expect(day("2026-07-20").closest("[role='gridcell']")).toHaveAttribute("aria-selected", "true");
    expect(day("2026-07-09").closest("[role='gridcell']")).toHaveAttribute("aria-selected", "false");
  });

  it("solo un dia entra en el orden de tabulacion (roving tabindex)", async () => {
    setup();
    const tabbable = screen
      .getAllByRole("button")
      .filter((node) => node.getAttribute("tabindex") === "0");
    // La flecha anterior, el titulo, la flecha siguiente y UN solo dia.
    expect(tabbable.filter((node) => node.hasAttribute("data-tk-day"))).toHaveLength(1);
    // Sin nada elegido, el punto de entrada es hoy.
    expect(day("2026-07-09")).toHaveAttribute("tabindex", "0");
  });

  it("las flechas del teclado mueven el foco por dia y por semana", async () => {
    setup();
    day("2026-07-09").focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(day("2026-07-10")).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    expect(day("2026-07-17")).toHaveFocus();

    await userEvent.keyboard("{ArrowLeft}");
    expect(day("2026-07-16")).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(day("2026-07-09")).toHaveFocus();
  });

  it("Inicio y Fin van a los extremos de la semana visible", async () => {
    setup();
    // El 9 de julio de 2026 es jueves; con la semana en lunes va del 6 al 12.
    day("2026-07-09").focus();

    await userEvent.keyboard("{Home}");
    expect(day("2026-07-06")).toHaveFocus();

    await userEvent.keyboard("{End}");
    expect(day("2026-07-12")).toHaveFocus();
  });

  it("cruzar el borde del mes cambia la vista y el foco sigue al dia", async () => {
    const onMonthChange = vi.fn();
    setup({ onMonthChange });

    day("2026-07-01").focus();
    await userEvent.keyboard("{ArrowLeft}");

    // Sin este arrastre el foco se quedaria en un mes que ya no esta en pantalla.
    expect(day("2026-06-30")).toHaveFocus();
    expect(onMonthChange).toHaveBeenCalledTimes(1);
    expect(iso(onMonthChange.mock.calls[0]![0] as Date)).toBe("2026-06-01");
  });

  it("AvPag y RePag saltan de mes, y con Mayusculas de año", async () => {
    setup();
    day("2026-07-09").focus();

    await userEvent.keyboard("{PageDown}");
    expect(day("2026-08-09")).toHaveFocus();

    await userEvent.keyboard("{PageUp}");
    expect(day("2026-07-09")).toHaveFocus();

    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    expect(day("2025-07-09")).toHaveFocus();
  });

  it("AvPag satura el dia en vez de desbordar al mes siguiente", async () => {
    setup({ defaultMonth: new Date(2026, 0, 1) });
    // 31 de enero + 1 mes no puede ser el 3 de marzo.
    day("2026-01-31").focus();
    await userEvent.keyboard("{PageDown}");
    expect(day("2026-02-28")).toHaveFocus();
  });

  it("Enter y Espacio eligen el dia enfocado", async () => {
    const onSelect = vi.fn();
    setup({ onSelect });

    day("2026-07-09").focus();
    await userEvent.keyboard("{ArrowRight}{Enter}");
    expect(iso(onSelect.mock.calls[0]![0] as Date)).toBe("2026-07-10");

    await userEvent.keyboard("{ArrowRight}[Space]");
    expect(iso(onSelect.mock.calls[1]![0] as Date)).toBe("2026-07-11");
  });

  it("sin gobierno externo recuerda el dia elegido", async () => {
    setup();
    await userEvent.click(day("2026-07-20"));
    expect(day("2026-07-20").closest("[role='gridcell']")).toHaveAttribute("aria-selected", "true");
  });

  it("controlado, la seleccion la manda la prop y no el clic", async () => {
    const onSelect = vi.fn();
    setup({ selected: new Date(2026, 6, 20), onSelect });

    await userEvent.click(day("2026-07-21"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    // El estado vive fuera: hasta que el consumidor no reenvie `selected`, la
    // celda marcada sigue siendo la de antes.
    expect(day("2026-07-20").closest("[role='gridcell']")).toHaveAttribute("aria-selected", "true");
    expect(day("2026-07-21").closest("[role='gridcell']")).toHaveAttribute("aria-selected", "false");
  });

  it("un dia fuera de rango no se elige pero SIGUE siendo enfocable", async () => {
    const onSelect = vi.fn();
    setup({ minDate: new Date(2026, 6, 10), onSelect });

    const bloqueado = day("2026-07-08");
    await userEvent.click(bloqueado);
    expect(onSelect).not.toHaveBeenCalled();

    /* Deliberadamente NO usa el atributo disabled: si los dias bloqueados se
       saltaran, las flechas del teclado avanzarian a saltos impredecibles. */
    expect(bloqueado).not.toBeDisabled();
    expect(bloqueado).toHaveAttribute("aria-disabled", "true");
    bloqueado.focus();
    expect(bloqueado).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(day("2026-07-09")).toHaveFocus();
  });

  it("isDateDisabled bloquea dias sueltos", async () => {
    const onSelect = vi.fn();
    // Domingos fuera.
    setup({ isDateDisabled: (date) => date.getDay() === 0, onSelect });

    await userEvent.click(day("2026-07-12"));
    expect(onSelect).not.toHaveBeenCalled();

    await userEvent.click(day("2026-07-13"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("las flechas de mes navegan y se apagan en los topes", async () => {
    const onMonthChange = vi.fn();
    setup({ minDate: JULIO_2026, maxDate: new Date(2026, 7, 31), onMonthChange });

    const anterior = screen.getByRole("button", { name: "Mes anterior" });
    const siguiente = screen.getByRole("button", { name: "Mes siguiente" });

    expect(anterior).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(anterior);
    expect(onMonthChange).not.toHaveBeenCalled();

    await userEvent.click(siguiente);
    expect(iso(onMonthChange.mock.calls[0]![0] as Date)).toBe("2026-08-01");
    // Ya en agosto, el tope superior apaga la flecha de avanzar.
    expect(screen.getByRole("button", { name: "Mes siguiente" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("acepta el mes como prop controlada", async () => {
    const { rerender } = render(<Calendar month={JULIO_2026} today={HOY} formatDay={iso} />);
    expect(screen.queryByRole("button", { name: "2026-08-15" })).toBeNull();

    rerender(<Calendar month={new Date(2026, 7, 1)} today={HOY} formatDay={iso} />);
    expect(screen.getByRole("button", { name: "2026-08-15" })).toBeInTheDocument();
    // Al saltar de mes desde fuera el punto de entrada se recoloca dentro de la
    // vista nueva; si no, la rejilla se quedaria sin ninguna celda tabulable.
    expect(screen.getByRole("button", { name: "2026-08-01" })).toHaveAttribute("tabindex", "0");
  });

  it("showOutsideDays=false deja el hueco pero conserva las siete columnas", () => {
    setup({ showOutsideDays: false });
    expect(screen.queryByRole("button", { name: "2026-06-30" })).toBeNull();
    // 42 celdas siguen ahi: quitarlas descuadraria las columnas de la fila.
    expect(screen.getAllByRole("gridcell")).toHaveLength(42);
  });

  it("weekStartsOn cambia el arranque de la rejilla", () => {
    setup({ weekStartsOn: 0 });
    // Con la semana en domingo, julio de 2026 arranca el 28 de junio.
    expect(screen.getByRole("button", { name: "2026-06-28" })).toBeInTheDocument();
  });

  it("no pone los nombres de dia en mayusculas en JS, solo por CSS", () => {
    render(<Calendar defaultMonth={JULIO_2026} today={HOY} locale="es-ES" />);
    // Intl devuelve "lun" en minuscula; la clase capitalize hace el resto. Si
    // alguien metiera un toUpperCase() romperia el texto que copia el usuario.
    const nombres = screen.getAllByRole("columnheader").map((node) => node.textContent);
    expect(nombres.every((name) => name === name?.toLowerCase())).toBe(true);
  });

  it("permite sobreescribir estilos por className", () => {
    render(<CalendarDay className="rounded-none">1</CalendarDay>);
    // tailwind-merge debe descartar el rounded-sm de la base, no acumularlo.
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-sm");
  });
});
