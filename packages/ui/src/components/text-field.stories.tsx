import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField, Textarea } from "./text-field";

/* Los iconos del sistema son Phosphor, que aun no esta en el paquete. Estos
 * glifos inline sirven de marcador para las stories: lo unico que importa aqui
 * es que la ranura recibe un <svg> de 20 (o 16) px y que hereda currentColor. */
const Glifo = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Sobre = () => <Glifo d="M3 7h18v10H3zM3 7l9 6 9-6" />;
const Lupa = () => <Glifo d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M16 16l4 4" />;
const Ojo = () => <Glifo d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6m10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />;
const Check = () => <Glifo d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-4 9 3 3 5-6" />;
const Aviso = () => <Glifo d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 4v6m0 3.5v.5" />;
const Equis = () => <Glifo d="M6 6l12 12M18 6 6 18" />;

/* `Meta<typeof TextField>` anotado a mano y no `satisfies`: con el decorador
 * presente, TypeScript no puede nombrar el tipo inferido sin citar rutas
 * internas de Storybook (TS2742) y el typecheck del paquete falla. */
const meta: Meta<typeof TextField> = {
  title: "Componentes/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 11 · Inputs — CANONICO** para `TextField` (nodo `2:5155` del archivo de Figma, 24 variantes: `state` x `feedback` x `size`).",
          "",
          "La idea central es que **la etiqueta vive dentro** del campo: hace de placeholder y, al enfocar o al escribir, encoge y sube al borde superior. No hay label flotante arriba ni helper permanente — el mensaje aparece debajo **solo cuando aplica** y sustituye al helper, nunca se suma.",
          "",
          "Son **EXTENSION** (propuesta coherente con los tokens, no especificacion aprobada) las piezas que el documento dibuja pero que no estan en el componente de Figma: icono *leading*, capsulas de prefijo/sufijo, modo numerico y contador de caracteres.",
          "",
          "`Textarea` tambien es **EXTENSION**: el documento lo dice expresamente — *hereda los tokens del TextField del archivo; no es un componente aparte*.",
          "",
          "Medidas por tamaño (export de Figma): **L** 56 · r12 · px16 · texto 16 · icono 20 — **M** 48 · r10 · px12 · texto 16 · icono 20 — **S** 40 · r8 · px8 · texto 14 · icono 16 — **XS** 32 · r6 · px8 · texto 12 · icono 16.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["l", "m", "s", "xs"] },
    feedback: { control: "inline-radio", options: ["default", "success", "error"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    numeric: { control: "boolean" },
    counter: { control: "boolean" },
    startIcon: { control: false },
    endIcon: { control: false },
    endAction: { control: false },
    prefix: { control: false },
    suffix: { control: false },
  },
  args: { label: "Correo electrónico" },
  decorators: [
    (Story) => (
      <div className="w-[340px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TextField>;

/** Campo vacio: la etiqueta descansa centrada y hace de placeholder. */
export const PorDefecto: Story = {
  name: "Por defecto",
  args: { endIcon: <Sobre /> },
};

/** Con valor la etiqueta ya ha subido: sigue diciendo que se pide. */
export const ConValor: Story = {
  name: "Con valor",
  args: { defaultValue: "valentina@tikin.co", endIcon: <Sobre /> },
};

/** El icono de la izquierda es decorativo; no entra en el arbol accesible. */
export const IconoLeading: Story = {
  name: "Leading · buscar",
  args: { label: "Buscar contacto", startIcon: <Lupa /> },
};

/** `endAction` es una ranura interactiva: se alcanza con Tab desde el input. */
export const AccionFinal: Story = {
  name: "Contraseña · ojo",
  args: { label: "Contraseña" },
  render: (args) => {
    const Demo = () => {
      const [visible, setVisible] = React.useState(false);
      return (
        <TextField
          {...args}
          type={visible ? "text" : "password"}
          defaultValue="MiClave2026"
          endAction={
            <button
              type="button"
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setVisible((v) => !v)}
              className="grid size-9 cursor-pointer place-items-center rounded-md text-ink-600 transition-colors duration-140 hover:bg-surface-2"
            >
              <Ojo />
            </button>
          }
        />
      );
    };
    return <Demo />;
  },
};

/** Limpiar el campo: mismo hueco que el ojo, con la pastilla redonda del documento. */
export const Limpiar: Story = {
  name: "Trailing · limpiar",
  render: (args) => {
    const Demo = () => {
      const [valor, setValor] = React.useState("Valentina");
      return (
        <TextField
          {...args}
          label="TikinTAG"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          endAction={
            valor === "" ? undefined : (
              <button
                type="button"
                aria-label="Limpiar"
                onClick={() => setValor("")}
                className="grid size-[26px] cursor-pointer place-items-center rounded-pill bg-edge text-ink-700 [&_svg]:size-[14px]"
              >
                <Equis />
              </button>
            )
          }
        />
      );
    };
    return <Demo />;
  },
};

/** EXTENSION. Capsulas grises pegadas al borde, sin margenes negativos. */
export const Prefijo: Story = {
  name: "Prefijo · link",
  args: { label: "Tu TikinTAG", defaultValue: "valentina", prefix: "tikin.co/" },
};

/** EXTENSION. Cifras en DM Mono alineadas a la derecha; moneda en el sufijo. */
export const Dinero: Story = {
  args: {
    label: "Monto a enviar",
    numeric: true,
    defaultValue: "1.250.000",
    prefix: <span className="font-num text-ink">$</span>,
    suffix: "COP",
  },
};

/** El mensaje SUSTITUYE al helper: verde con check, o rojo con aviso. */
export const Exito: Story = {
  name: "Éxito",
  args: {
    label: "TikinTAG",
    defaultValue: "valentina",
    feedback: "success",
    endIcon: <span className="text-fg-success"><Check /></span>,
    message: (
      <>
        <Check />
        TikinTAG disponible.
      </>
    ),
  },
};

/* Se exporta como ConError y no como Error: un export llamado Error tapa el
 * constructor global dentro del modulo. */
export const ConError: Story = {
  name: "Error",
  args: {
    defaultValue: "Va",
    feedback: "error",
    message: (
      <>
        <Aviso />
        Mínimo 3 caracteres.
      </>
    ),
  },
};

/** Apagado del todo: ni foco ni cursor. */
export const Deshabilitado: Story = { args: { disabled: true, endIcon: <Sobre /> } };

/**
 * Solo lectura no es lo mismo que deshabilitado: conserva el foco para que el
 * texto se pueda seleccionar y copiar.
 */
export const SoloLectura: Story = {
  name: "Solo lectura",
  args: { readOnly: true, defaultValue: "valentina@tikin.co" },
};

/** EXTENSION. El contador funciona controlado y sin controlar. */
export const ConContador: Story = {
  name: "Con contador",
  args: { label: "Tu TikinTAG", defaultValue: "valentina", maxLength: 20, counter: true },
};

/** L 56·r12 · M 48·r10 · S 40·r8 · XS 32·r6. Medidas del export de Figma. */
export const Tamanos: Story = {
  name: "Tamaños",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <TextField size="l" label="Grande · 56 · r12" endIcon={<Ojo />} />
      <TextField size="m" label="Mediano · 48 · r10" endIcon={<Ojo />} />
      <TextField size="s" label="Pequeño · 40 · r8" endIcon={<Ojo />} />
      <TextField size="xs" label="Mínimo · 32 · r6" endIcon={<Ojo />} />
    </div>
  ),
};

/** Matriz de especificacion de la seccion 11. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => {
    const filas = [
      { rotulo: "DEFAULT", props: { label: "Correo electrónico" } },
      { rotulo: "LLENO", props: { label: "Correo electrónico", defaultValue: "valentina@tikin.co" } },
      {
        rotulo: "ÉXITO",
        props: {
          label: "TikinTAG",
          defaultValue: "valentina",
          feedback: "success",
          message: "TikinTAG disponible.",
        },
      },
      {
        rotulo: "ERROR",
        props: {
          label: "TikinTAG",
          defaultValue: "Va",
          feedback: "error",
          message: "Mínimo 3 caracteres.",
        },
      },
      { rotulo: "DISABLED", props: { label: "Correo electrónico", disabled: true } },
      {
        rotulo: "SOLO LECTURA",
        props: { label: "Correo electrónico", readOnly: true, defaultValue: "valentina@tikin.co" },
      },
    ] as const;

    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        {filas.map(({ rotulo, props }) => (
          <div key={rotulo} className="flex flex-col gap-2">
            <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              {rotulo}
            </span>
            <TextField {...props} />
          </div>
        ))}
      </div>
    );
  },
};

/* ------------------------------------------------------------------------- */

type TextareaStory = StoryObj<typeof Textarea>;

/**
 * EXTENSION. La etiqueta va ARRIBA, no dentro: con varias lineas no tiene donde
 * encogerse sin comerse la primera linea de texto. Todo lo demas — borde 0.5px,
 * radio 12, foco en tinta — sale del TextField del archivo.
 */
export const AreaDeTexto: TextareaStory = {
  name: "Textarea · label + helper",
  parameters: { controls: { disable: true } },
  render: () => (
    <Textarea
      label="Descripción del envío"
      helper="Lo verá quien reciba."
      defaultValue="Arriendo de julio"
    />
  ),
};

/** Aqui el helper SI convive con el mensaje: la etiqueta esta fuera del campo. */
export const AreaConContador: TextareaStory = {
  name: "Textarea · contador",
  parameters: { controls: { disable: true } },
  render: () => (
    <Textarea
      label="Nota"
      maxLength={300}
      counter
      defaultValue="Gracias por tu ayuda este mes"
    />
  ),
};

/** Redimensiona solo en vertical: a lo ancho se saldria de la columna. */
export const AreaFija: TextareaStory = {
  name: "Textarea · sin redimensionar",
  parameters: { controls: { disable: true } },
  render: () => <Textarea label="Motivo" resizable={false} placeholder="Cuéntanos el motivo" />,
};

/** Matriz de especificacion del bloque Textarea. */
export const MatrizTextarea: TextareaStory = {
  name: "Textarea · matriz de estados",
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => {
    const filas = [
      { rotulo: "DEFAULT", props: { placeholder: "Placeholder" } },
      { rotulo: "FILLED", props: { defaultValue: "Arriendo de julio, gracias" } },
      { rotulo: "DISABLED", props: { defaultValue: "Arriendo de julio", disabled: true } },
      {
        rotulo: "ERROR",
        props: {
          defaultValue: "Muy corto",
          feedback: "error" as const,
          message: "Mínimo 10 caracteres.",
        },
      },
    ];

    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {filas.map(({ rotulo, props }) => (
          <div key={rotulo} className="flex flex-col gap-2">
            <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              {rotulo}
            </span>
            <Textarea {...props} />
          </div>
        ))}
      </div>
    );
  },
};
