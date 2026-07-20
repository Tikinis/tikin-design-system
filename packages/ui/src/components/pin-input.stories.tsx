import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PinInput, type PinFeedback } from "./pin-input";

const meta = {
  title: "Componentes/PinInput",
  component: PinInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Sección 44 · PIN — MIXTO.**",
          "",
          "- **Estados del punto — CANÓNICO.** Es el único bloque de especificación de la sección: 16×16, círculo, separación 12. Vacío = aro inset de 1.5 en `--tk-border-2`; lleno = tinta; error = purered-600; correcto = `--tk-fg-success`.",
          "- **Teclado y biometría — EXTENSIÓN.** Solo existen dentro del bloque *EN VIVO · PRUÉBALO*, que es demo interactiva, no especificación. Se conservan sus valores (tecla 52 de alto, r12, DM Mono 22; atajo de 40 de alto, r10, mono 13) porque no hay otra fuente, pero léelos como propuesta. Esas medidas son las de `Keypad`, así que el teclado del PIN **es** ese componente: no se redibuja, se compone — y con él vienen su rejilla accesible, el foco itinerante y la navegación por flechas.",
          "",
          "Tres reglas de uso mandan sobre la apariencia:",
          "",
          "1. **Nunca se muestran las cifras.** El campo real es un `input type=password`: el enmascarado es semántica, no pintura.",
          "2. **Se valida solo**, sin botón de confirmar — eso es `onComplete`, que se dispara al llenar el último punto.",
          "3. **Error = shake.** Los puntos pasan a rojo, la fila se agita y la clave se limpia sola para reintentar.",
          "",
          'Bajo los puntos hay un campo invisible pero enfocable. No es un adorno: es lo que hace funcionar el teclado físico, el pegado, el autorrelleno y el lector de pantalla. Con `keypad` activo lleva `inputMode="none"` para que el teclado del sistema no tape al teclado propio. La pista de autorrelleno es `current-password` — esto es la clave de la app, no un código de un solo uso; para eso está `OtpInput` — y se puede cambiar con `autoComplete`.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8 } },
    feedback: { control: "inline-radio", options: ["default", "error", "success"] },
    keypad: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    hint: { control: "text" },
  },
  args: { label: "Ingresa tu clave" },
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PorDefecto: Story = { name: "Por defecto" };

/** Sin teclado propio: en desktop el PIN se teclea con el teclado del sistema. */
export const SinTeclado: Story = {
  name: "Sin teclado",
  args: { keypad: false, hint: "Usa el teclado numérico" },
};

/** Face ID o huella como atajo bajo el teclado; el PIN siempre queda como alternativa. */
export const ConBiometria: Story = {
  name: "Con biometría",
  args: { onBiometric: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          "El atajo solo aparece si se pasa `onBiometric`. El label va en mayúsculas por CSS, nunca con `.toUpperCase()`: eso rompería el texto accesible y lo que se copia al portapapeles.",
      },
    },
  },
};

/** Los cuatro puntos en rojo, la fila hace shake y la clave se limpia sola. */
export const ClaveIncorrecta: Story = {
  name: "Error",
  args: { defaultValue: "1234", feedback: "error", hint: "Clave incorrecta", clearOnError: false },
  parameters: {
    docs: {
      description: {
        story:
          "Aquí `clearOnError` va en `false` para poder ver el estado quieto. En producto se deja en su valor por defecto: el componente limpia la clave al terminar la animación, porque el consumidor sabe que falló pero no cuándo acaba el shake. El shake y la limpieza responden a la **transición** a `error`: devuelve `feedback` a `default` al empezar un intento nuevo para que vuelvan a dispararse. No se cuentan los intentos a propósito — el contador subiría al llenar el último punto, no al conocer el resultado, y con validación asíncrona eso borraría un PIN correcto antes de validarlo. Mientras el estado sea `error`, teclear con la clave llena empieza un intento nuevo en lugar de ignorarse.",
      },
    },
  },
};

export const Correcto: Story = {
  args: { defaultValue: "1234", feedback: "success", hint: "Clave correcta" },
};

export const Deshabilitado: Story = { args: { disabled: true, defaultValue: "12" } };

/** Seis dígitos: la longitud es libre, el canon del archivo son cuatro. */
export const SeisDigitos: Story = {
  name: "Seis dígitos",
  args: { length: 6, label: "Código de verificación", keypad: false },
};

/**
 * Bloque canónico ESTADOS DEL PUNTO: vacío · escribiendo · error · correcto.
 * Sin teclado, para leer la fila de puntos aislada.
 */
export const EstadosDelPunto: Story = {
  name: "Estados del punto",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas: Array<{ etiqueta: string; value: string; feedback: PinFeedback }> = [
      { etiqueta: "VACÍO", value: "", feedback: "default" },
      { etiqueta: "ESCRIBIENDO 2/4", value: "12", feedback: "default" },
      { etiqueta: "ERROR", value: "1234", feedback: "error" },
      { etiqueta: "CORRECTO", value: "1234", feedback: "success" },
    ];
    return (
      <div className="flex flex-wrap gap-7">
        {filas.map((fila) => (
          <div key={fila.etiqueta} className="flex flex-col items-center gap-2">
            <PinInput
              value={fila.value}
              feedback={fila.feedback}
              keypad={false}
              clearOnError={false}
              onChange={() => {}}
              aria-label={fila.etiqueta}
              className="gap-0"
            />
            <span className="font-meta text-[11px] text-ink-500">{fila.etiqueta}</span>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Flujo completo con validación automática: clave correcta 1234.
 * Al llenar el cuarto punto se valida solo, sin botón.
 */
export const EnVivo: Story = {
  name: "En vivo · pruébalo",
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [pin, setPin] = React.useState("");
      const [feedback, setFeedback] = React.useState<PinFeedback>("default");
      const [hint, setHint] = React.useState<React.ReactNode>("Clave de prueba: 1234");

      return (
        <PinInput
          label="Ingresa tu clave"
          value={pin}
          feedback={feedback}
          hint={hint}
          onChange={(valor) => {
            setPin(valor);
            // Al limpiarse sola tras el error, el estado vuelve a neutro.
            if (valor === "") {
              setFeedback("default");
              setHint("Inténtalo de nuevo");
            }
          }}
          onComplete={(valor) => {
            const ok = valor === "1234";
            setFeedback(ok ? "success" : "error");
            setHint(ok ? "Clave correcta" : "Clave incorrecta");
          }}
          onBiometric={() => {
            setPin("1234");
            setFeedback("success");
            setHint("Autenticado con biometría");
          }}
        />
      );
    }
    return <Demo />;
  },
};
