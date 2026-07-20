import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AmountDisplay, Keypad, formatAmount, parseAmount } from "./keypad";

const meta = {
  title: "Componentes/Keypad",
  component: Keypad,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 43 · Teclado numerico & monto — EXTENSION.**",
          "",
          'La seccion dice "basado en el numpad y las pantallas de monto del archivo": basado en, no sacado de. El archivo de Figma trae un numpad (`Keyboard/Numpad`, nodo 2:124) pero es una **replica del teclado nativo de iOS** — 393x289, fondo gris fijo, teclas 117x46 en SF Pro. Nada de eso aplica dentro de la pantalla de monto. La geometria sale del prototipo de la seccion 43, asi que **no es especificacion aprobada**.',
          "",
          "- **Monto protagonista** — DM Mono 40–56, centrado. Placeholder `$ 0` en gris; al escribir pasa a tinta. Miles con punto, decimal con coma (es-CO).",
          "- **Teclado propio** — el dinero nunca se escribe con el teclado del sistema. Numpad de 52 de alto, tecla ⌫ y, cuando aplica, coma decimal o biometria en la esquina.",
          "- **Validacion viva** — si el monto supera el saldo, el numero y la ayuda pasan a rojo y la CTA se deshabilita. La escritura **nunca** se bloquea.",
          "",
          "Geometria: tecla 52 de alto · r12 · sin borde · DM Mono 500 · 22 (icono 22, biometria 24) · rejilla de 3 columnas con hueco 8 y tope de ancho 300.",
          "",
          'El valor viaja siempre en **crudo** (`"1250"`, `"1250,5"`); `formatAmount` lo presenta y `parseAmount` lo compara contra el saldo.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    action: { control: "inline-radio", options: ["none", "decimal", "biometric"] },
    disabled: { control: "boolean" },
    maxIntegerDigits: { control: { type: "number", min: 1, max: 12 } },
    maxDecimals: { control: { type: "number", min: 0, max: 2 } },
    value: { control: false },
    defaultValue: { control: false },
  },
  args: { action: "none", disabled: false },
} satisfies Meta<typeof Keypad>;

export default meta;
type Story = StoryObj<typeof meta>;

/** El numpad solo, sin monto. Se gobierna a si mismo. */
export const Basico: Story = {};

/** Coma decimal en la esquina, para montos con centavos. */
export const ConDecimal: Story = { args: { action: "decimal" } };

/** Biometria en la esquina: confirma sin salir del teclado. Nunca toca el monto. */
export const ConBiometria: Story = {
  args: { action: "biometric" },
  parameters: {
    docs: {
      description: {
        story:
          "`onBiometric` es un evento aparte de `onValueChange`: la huella autentica, no escribe.",
      },
    },
  },
};

/** Sin reaccion al cursor y sin escritura por teclado fisico. */
export const Deshabilitado: Story = { args: { disabled: true, defaultValue: "125000" } };

/* ------------------------------------------------------------------ *
 * Composicion con el monto
 * ------------------------------------------------------------------ */

const SALDO = 4_250_000;
const SUGERIDOS = [20_000, 50_000, 100_000, 250_000];

function PantallaDeMonto({ action }: { action?: "none" | "decimal" | "biometric" }) {
  const [monto, setMonto] = React.useState("");
  const excede = parseAmount(monto) > SALDO;

  return (
    <div className="flex w-[340px] flex-col items-center gap-6 py-4">
      <AmountDisplay
        label="Vas a enviar"
        value={monto}
        invalid={excede}
        hint={excede ? "Supera tu saldo disponible" : `Saldo $ ${formatAmount(SALDO)}`}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {SUGERIDOS.map((n) => (
          // En la app real esto es <Chip variant="action">. Aqui va suelto para
          // que la story no dependa de otro componente del sistema.
          <button
            key={n}
            type="button"
            onClick={() => setMonto(String(n))}
            className="h-9 cursor-pointer rounded-(--radius-pill) px-3.5 font-mono text-[13px] tracking-[0.02em] text-ink shadow-[inset_0_0_0_1px_var(--tk-border-2)] transition-colors hover:bg-surface-2"
          >
            $ {formatAmount(n)}
          </button>
        ))}
      </div>

      <Keypad value={monto} onValueChange={setMonto} action={action ?? "none"} />

      {/* La validacion viva deshabilita la CTA, nunca la escritura. */}
      <button
        type="button"
        disabled={excede || monto === ""}
        className="h-12 w-full cursor-pointer rounded-lg bg-ink font-mono tracking-[0.02em] text-surface uppercase disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-500"
      >
        Continuar
      </button>
    </div>
  );
}

/** La pantalla completa: monto, chips sugeridos, numpad y CTA. */
export const PantallaCompleta: Story = {
  name: "Pantalla de monto",
  parameters: { controls: { disable: true } },
  render: () => <PantallaDeMonto />,
};

/** Los chips rellenan el monto de una vez; el teclado lo ajusta cifra a cifra. */
export const ValidacionViva: Story = {
  name: "Validación viva",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Escribe mas de $ 4.250.000: el numero y la ayuda pasan a rojo y la CTA se apaga, pero el teclado sigue aceptando cifras. Bloquear la escritura dejaria al usuario sin poder corregir con ⌫.",
      },
    },
  },
  render: () => <PantallaDeMonto action="decimal" />,
};

/* ------------------------------------------------------------------ *
 * Matrices de especificacion
 * ------------------------------------------------------------------ */

const rotulo = "font-meta text-ink-600 text-[11px] tracking-[0.1em] uppercase";

/** Las cuatro teclas del documento: numerica, borrar, decimal y biometria. */
export const VariantesDeTecla: Story = {
  name: "Variantes de tecla",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "La tira del documento dibuja las teclas en cajas de 64 de ancho, pero eso es el especimen aislado: en la rejilla real son columnas iguales. Y solo dibuja dos estados, DEFAULT y PRESSED, porque una tira estatica no puede enseñar hover — la rampa completa es hover `--tk-surface-2`, pressed `--tk-border`.",
      },
    },
  },
  render: () => (
    // Se pintan teclados completos porque la tecla no es exportable por si
    // sola: es una celda de la rejilla, no un componente publico. Las cuatro
    // variantes del documento estan aqui — numerica y borrar en los tres,
    // decimal y biometria segun `action`.
    <div className="flex flex-wrap gap-10">
      {(["none", "decimal", "biometric"] as const).map((action) => (
        <div key={action} className="flex flex-col items-center gap-2">
          <Keypad className="w-[220px]" action={action} />
          <div className={rotulo}>action=&quot;{action}&quot;</div>
        </div>
      ))}
    </div>
  ),
};

/** DM Mono 40 · 44 · 56 — el rango que da el documento, con el 44 del prototipo en medio. */
export const TamanosDeMonto: Story = {
  name: "Tamaños de monto",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {(
        [
          ["s", "40"],
          ["m", "44 · por defecto"],
          ["l", "56"],
        ] as const
      ).map(([size, pie]) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <AmountDisplay size={size} value="1250000" />
          <div className={rotulo}>{pie}</div>
        </div>
      ))}
    </div>
  ),
};

/** Los tres estados del monto: placeholder, escrito y por encima del saldo. */
export const EstadosDelMonto: Story = {
  name: "Estados del monto",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-12">
      <div className="flex flex-col items-center gap-2">
        <AmountDisplay label="Vas a enviar" hint="Saldo $ 4.250.000" />
        <div className={rotulo}>placeholder</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AmountDisplay label="Vas a enviar" value="125000" hint="Saldo $ 4.250.000" />
        <div className={rotulo}>escrito</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AmountDisplay
          label="Vas a enviar"
          value="5000000"
          invalid
          hint="Supera tu saldo disponible"
        />
        <div className={rotulo}>inválido</div>
      </div>
    </div>
  ),
};
