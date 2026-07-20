import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OtpInput } from "./otp-input";

const meta = {
  title: "Componentes/OtpInput",
  component: OtpInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Sección 36 · OTP — EXTENSIÓN** construida con los tokens del sistema.",
          "",
          "No existe en el archivo de Figma: el propio documento la etiqueta como",
          '"Extensión con la paleta del sistema". La geometría sale del prototipo',
          "(casilla 48×56, radio 12, gap 10, cifras en DM Mono 22) y los colores de",
          "los tokens ya aprobados del TextField. **No es especificación aprobada.**",
          "",
          "Reglas de uso del documento:",
          "",
          "- **Auto-avance** — cada dígito salta a la siguiente casilla; borrar retrocede. Pegar el código completo lo reparte.",
          "- **Foco y error** — la casilla activa lleva borde tinta y caret; al fallar, las seis se marcan en rojo con mensaje y contador de intentos.",
          "- **Reenvío** — reenviar con cuenta regresiva para evitar spam; teclado numérico en móvil y autocompletado del SMS.",
          "",
          "Bajo las casillas hay **un solo `<input>`** transparente, no seis: es lo que",
          'permite el autocompletado del SMS (`autocomplete="one-time-code"`), que pegar',
          "funcione sin código extra y que el lector de pantalla anuncie el código entero.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8 } },
    feedback: { control: "inline-radio", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    message: { control: "text" },
  },
  args: { length: 6 },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Vacío y sin foco: seis casillas en reposo, borde 0.5px. */
export const Vacio: Story = { name: "Vacío" };

/** Escribiendo · 3 / 6. La casilla activa lleva borde tinta y caret parpadeando. */
export const Escribiendo: Story = {
  args: { defaultValue: "314" },
  parameters: {
    docs: {
      description: {
        story:
          "Haz clic en las casillas: el borde tinta y el caret solo se dibujan cuando el campo tiene el foco. Sin `autoFocus` a propósito — en la página de docs robaría el scroll. Con el código completo la última casilla sigue activa pero pierde el caret: se solaparía con la cifra.",
      },
    },
  },
};

/** Error · código incorrecto. Las seis en rojo, con mensaje y contador de intentos. */
export const ConError: Story = {
  name: "Error",
  args: {
    defaultValue: "999999",
    feedback: "error",
    message: "Código incorrecto. Te quedan 2 intentos.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Al enfocar, el borde NO vuelve a tinta: solo engorda el rojo. Perder la señal justo mientras se corrige sería lo contrario de ayudar.",
      },
    },
  },
};

/** Válido · 6 / 6. */
export const Valido: Story = {
  name: "Válido",
  args: { defaultValue: "314279", feedback: "success", message: "Verificado" },
};

/** Deshabilitado: gris apagado que gana al rojo y al verde. Un campo inerte no da feedback. */
export const Deshabilitado: Story = {
  args: { defaultValue: "", disabled: true, length: 4 },
};

/** Solo lectura: enseña el código y deja copiarlo, pero no invita a escribir. */
export const SoloLectura: Story = {
  name: "Solo lectura",
  args: { value: "314279", readOnly: true },
};

/** El documento dibuja 6 (por defecto) y 4. La fila se ajusta al número de casillas. */
export const Longitudes: Story = {
  name: "Longitudes",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {[4, 6, 8].map((n) => (
        <div key={n} className="flex flex-col gap-3.5">
          <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
            {n} casillas
          </span>
          <OtpInput length={n} defaultValue="8" />
        </div>
      ))}
    </div>
  ),
};

/** Matriz de especificación: los cinco estados del documento, lado a lado. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      { estado: "Reposo", props: {} },
      { estado: "Parcial · 3 / 6", props: { defaultValue: "314" } },
      {
        estado: "Error",
        props: {
          defaultValue: "999999",
          feedback: "error" as const,
          message: "Código incorrecto. Te quedan 2 intentos.",
        },
      },
      {
        estado: "Válido",
        props: { defaultValue: "314279", feedback: "success" as const, message: "Verificado" },
      },
      { estado: "Deshabilitado", props: { disabled: true } },
    ];

    return (
      <div className="flex flex-col gap-8">
        {filas.map(({ estado, props }) => (
          <div key={estado} className="flex flex-col gap-3.5">
            <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              {estado}
            </span>
            <OtpInput {...props} />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Pantalla completa: campo, reenvío con cuenta regresiva y verificación
 * automática al completar las seis cifras.
 */
export const PantallaDeVerificacion: Story = {
  name: "Pantalla de verificación",
  parameters: { controls: { disable: true } },
  render: () => {
    function Pantalla() {
      const CORRECTO = "314279";
      const [code, setCode] = React.useState("");
      const [estado, setEstado] = React.useState<"default" | "error" | "success">("default");
      const [intentos, setIntentos] = React.useState(3);
      const [segundos, setSegundos] = React.useState(45);

      React.useEffect(() => {
        if (segundos === 0) return;
        const t = window.setTimeout(() => setSegundos((s) => s - 1), 1000);
        return () => window.clearTimeout(t);
      }, [segundos]);

      const verificar = (valor: string) => {
        if (valor === CORRECTO) {
          setEstado("success");
          return;
        }
        setEstado("error");
        setIntentos((n) => Math.max(0, n - 1));
      };

      const mensaje =
        estado === "success"
          ? "Verificado"
          : estado === "error"
            ? `Código incorrecto. Te quedan ${intentos} intentos.`
            : undefined;

      return (
        <div className="flex w-[380px] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-xl font-semibold text-ink">Verifica tu ingreso</h3>
            <p className="font-sans text-sm text-ink-700">
              Enviamos un código de 6 dígitos al •••• 4821. El correcto es{" "}
              <span className="font-num">314279</span>.
            </p>
          </div>

          <OtpInput
            value={code}
            feedback={estado}
            message={mensaje}
            onValueChange={(next) => {
              setCode(next);
              // Al corregir, el error desaparece: la señal roja solo describe
              // el intento anterior.
              if (estado !== "default" && next.length < 6) setEstado("default");
            }}
            onComplete={verificar}
          />

          <div className="flex items-center gap-2 font-sans text-[13.5px] text-ink-600">
            ¿No llegó?
            {segundos > 0 ? (
              <span className="font-mono text-xs tracking-[0.02em] text-ink-500 uppercase">
                Reenviar en 0:{String(segundos).padStart(2, "0")}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setSegundos(45)}
                className="cursor-pointer font-mono text-xs tracking-[0.02em] text-ink uppercase underline underline-offset-4"
              >
                Reenviar código
              </button>
            )}
          </div>
        </div>
      );
    }

    return <Pantalla />;
  },
};
