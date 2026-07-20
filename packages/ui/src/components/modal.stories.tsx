import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetItem,
  BottomSheetList,
  BottomSheetTitle,
  BottomSheetTrigger,
  Modal,
  ModalAction,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalIcon,
  ModalTitle,
  ModalTrigger,
} from "./modal";

/* La libreria de iconos oficial es Phosphor, pero NO es dependencia de
 * @tikin/ui: el consumidor pasa sus propios nodos. Estos glifos son de atrezzo
 * para las stories, deliberadamente genericos, y no forman parte del sistema. */
function Glifo({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      {children}
    </svg>
  );
}
const IconoCheck = () => (
  <Glifo>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
  </Glifo>
);
const IconoPapelera = () => (
  <Glifo>
    <path d="M4 7h16M9 7V5h6v2M6.5 7l1 12h9l1-12" strokeLinecap="round" strokeLinejoin="round" />
  </Glifo>
);
const IconoInfo = () => (
  <Glifo>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
  </Glifo>
);
const IconoPersona = () => (
  <Glifo>
    <circle cx="12" cy="9" r="3.25" />
    <path d="M5.5 19a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
  </Glifo>
);
const IconoQR = () => (
  <Glifo>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.5M20 14v6h-6v-2.5" />
  </Glifo>
);
const IconoBanco = () => (
  <Glifo>
    <path d="M3.5 9.5 12 5l8.5 4.5M5.5 10v7M10 10v7M14 10v7M18.5 10v7M3.5 19.5h17" strokeLinecap="round" />
  </Glifo>
);
const IconoChevron = () => (
  <Glifo>
    <path d="m9.5 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </Glifo>
);

const meta = {
  title: "Componentes/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 42 · Modales & bottom sheets — MIXTO.**",
          "",
          "Superficies que interrumpen para confirmar o decidir. El **modal** centra una decision de 1–2 opciones; la **bottom sheet** sube desde abajo con una lista de acciones o un mini-formulario, y respeta el safe-area inferior.",
          "",
          "### Que viene del archivo y que no",
          "",
          "La seccion se declara *basada en Dialog details / Dialog master del archivo*, pero el export de Figma de esos nodos es la **alerta nativa de iOS** — 270 de ancho, radio 14 solo arriba, SF Pro 17/13, fondo translucido con blur. El documento re-especifica la superficie entera con los tokens de Tikin: **ancho 340 · radio 20 · padding 24 · Funnel Display 19 · Sans 14 · sombra xl**.",
          "",
          "Asi que el origen es del archivo, pero la geometria **no**: aqui se implementa lo que dice el documento. La `BottomSheet` no existe en el archivo en ninguna forma — es **extension** construida con los mismos tokens.",
          "",
          "### Reglas",
          "",
          "- **Siempre una salida.** Toda superficie modal se cierra con el scrim, con Escape o — en la sheet — arrastrando el grabber. Nunca atrapa al usuario.",
          "- **Scrim tinta 45%.** El foco entra al primer control y vuelve al disparador al cerrar (lo hace Radix).",
          "- **Destructivo en rojo.** Solo la accion irreversible. La confirmacion normal va en tinta.",
          "- **Nunca dos primarias.** La salida va en `ghost`, debajo, nunca al lado.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Decision normal: CTA en tinta, salida Ghost debajo. */
export const Confirmar: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger asChild>
        <Button family="compact">Abrir modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalIcon tone="info">
          <IconoCheck />
        </ModalIcon>
        <ModalTitle>Confirmar envío</ModalTitle>
        <ModalDescription>Vas a enviar $250.000 a $mariarojas.</ModalDescription>
        <ModalFooter>
          <ModalClose asChild>
            <ModalAction>Confirmar</ModalAction>
          </ModalClose>
          <ModalClose asChild>
            <ModalAction variant="ghost">Cancelar</ModalAction>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

/** El unico caso con rojo: la accion no se puede deshacer. */
export const Destructivo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "El rojo sale de `--tk-fg-error`, que invierte con el tema. El cuerpo dice explicitamente que no se puede deshacer: el color avisa, pero no es la advertencia.",
      },
    },
  },
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger asChild>
        <Button family="compact" variant="secondary">
          Modal destructivo
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalIcon tone="danger">
          <IconoPapelera />
        </ModalIcon>
        <ModalTitle>Eliminar bolsillo</ModalTitle>
        <ModalDescription>
          Se perderá el historial de este bolsillo. No se puede deshacer.
        </ModalDescription>
        <ModalFooter>
          <ModalClose asChild>
            <ModalAction tone="danger">Eliminar</ModalAction>
          </ModalClose>
          <ModalClose asChild>
            <ModalAction variant="ghost">Cancelar</ModalAction>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

/** Una sola salida: el modal informa, no pregunta. */
export const Informativo: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger asChild>
        <Button family="compact" variant="secondary">
          Modal informativo
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalIcon tone="info">
          <IconoInfo />
        </ModalIcon>
        <ModalTitle>Actualiza la app</ModalTitle>
        <ModalDescription>Hay una versión nueva con mejoras de seguridad.</ModalDescription>
        <ModalFooter>
          <ModalClose asChild>
            <ModalAction>Actualizar</ModalAction>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

/** Anatomía completa: icono 44 · título 19 · cuerpo 14 · CTA 48 + salida 44. */
export const Resultado: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "El icono de estado de 44 es **opcional** y solo aparece cuando el modal comunica el resultado de algo. Es decorativo (`aria-hidden`): el mensaje lo lleva el título.",
      },
    },
  },
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger asChild>
        <Button family="compact">Ver resultado</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalIcon tone="success">
          <IconoCheck />
        </ModalIcon>
        <ModalTitle>Envío completado</ModalTitle>
        <ModalDescription>
          $250.000 llegaron a $mariarojas. Guardamos el comprobante en tus movimientos.
        </ModalDescription>
        <ModalFooter>
          <ModalClose asChild>
            <ModalAction>Ver comprobante</ModalAction>
          </ModalClose>
          <ModalClose asChild>
            <ModalAction variant="ghost">Listo</ModalAction>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

/** Sin icono: la mayoría de confirmaciones no lo necesitan. */
export const SinIcono: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger asChild>
        <Button family="compact">Abrir</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle>Cerrar sesión</ModalTitle>
        <ModalDescription>Tendrás que volver a entrar con tu clave.</ModalDescription>
        <ModalFooter>
          <ModalClose asChild>
            <ModalAction>Cerrar sesión</ModalAction>
          </ModalClose>
          <ModalClose asChild>
            <ModalAction variant="ghost">Cancelar</ModalAction>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

/** La acción tarda: `disabled` mientras se resuelve, sin cerrar el modal. */
export const AccionEnCurso: Story = {
  name: "Acción en curso",
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [enviando, setEnviando] = React.useState(false);
      const [abierto, setAbierto] = React.useState(false);
      return (
        <Modal
          open={abierto}
          // Los tipos de `radix-ui` no se resuelven en este tsconfig y llegan
          // como any, asi que el parametro se anota a mano.
          onOpenChange={(v: boolean) => {
            setAbierto(v);
            if (!v) setEnviando(false);
          }}
        >
          <ModalTrigger asChild>
            <Button family="compact">Enviar dinero</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalTitle>Confirmar envío</ModalTitle>
            <ModalDescription>Vas a enviar $250.000 a $mariarojas.</ModalDescription>
            <ModalFooter>
              {/* El modal se controla desde fuera para poder cerrarlo cuando la
                  peticion termine, no en cuanto se pulsa. */}
              <ModalAction
                disabled={enviando}
                onClick={() => {
                  setEnviando(true);
                  window.setTimeout(() => setAbierto(false), 1400);
                }}
              >
                {enviando ? "Enviando…" : "Confirmar"}
              </ModalAction>
              <ModalClose asChild>
                <ModalAction variant="ghost" disabled={enviando}>
                  Cancelar
                </ModalAction>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    }
    return <Demo />;
  },
};

/* ------------------------------------------------------------------ */
/* BOTTOM SHEET                                                        */
/* ------------------------------------------------------------------ */

/** Lista de acciones que sube desde abajo. Se cierra con scrim, Esc o gesto. */
export const Sheet: Story = {
  name: "Bottom sheet",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El grabber de 36×4 no es decoración: arrastrarlo hacia abajo más de 96px cierra la hoja. Es la tercera salida que exige el documento, junto al scrim y Escape.",
      },
    },
  },
  render: () => (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <Button family="compact" variant="secondary">
          Abrir bottom sheet
        </Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetTitle>Enviar dinero a</BottomSheetTitle>
        <BottomSheetDescription>Elige a quién le vas a transferir.</BottomSheetDescription>
        <BottomSheetList>
          <BottomSheetItem
            icon={<IconoPersona />}
            title="$mariarojas"
            description="María Rojas"
            endIcon={<IconoChevron />}
          />
          <BottomSheetItem
            icon={<IconoPersona />}
            title="$carlosp"
            description="Carlos Pérez"
            endIcon={<IconoChevron />}
          />
          <BottomSheetItem
            icon={<IconoQR />}
            title="Escanear QR"
            description="Paga a un negocio"
            endIcon={<IconoChevron />}
          />
          <BottomSheetItem
            icon={<IconoBanco />}
            title="Cuenta bancaria"
            description="PSE o transferencia"
            endIcon={<IconoChevron />}
          />
        </BottomSheetList>
      </BottomSheetContent>
    </BottomSheet>
  ),
};

/** La hoja también aloja un mini-formulario, no solo listas. */
export const SheetConFormulario: Story = {
  name: "Bottom sheet con formulario",
  parameters: { controls: { disable: true } },
  render: () => (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <Button family="compact" variant="secondary">
          Editar alias
        </Button>
      </BottomSheetTrigger>
      <BottomSheetContent aria-describedby={undefined}>
        <BottomSheetTitle>Editar alias</BottomSheetTitle>
        <div className="flex flex-col gap-3 px-1 pt-2 pb-1">
          <input
            aria-label="Alias"
            defaultValue="$mariarojas"
            className="h-control-l rounded-lg border border-edge bg-surface px-4 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink"
          />
          <ModalAction>Guardar</ModalAction>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  ),
};

/* ------------------------------------------------------------------ */
/* MATRIZ DE ESPECIFICACION                                            */
/* ------------------------------------------------------------------ */

/**
 * Las tres variantes del documento, acotadas dentro de su caja.
 *
 * `container` + `overlayClassName="absolute"` sacan el scrim del viewport y lo
 * meten en un contenedor concreto — es como el documento monta su demo en vivo.
 */
export const MatrizDeVariantes: Story = {
  name: "Matriz de variantes",
  parameters: { controls: { disable: true } },
  render: () => {
    const variantes = [
      {
        id: "confirmar",
        tone: "info",
        icono: <IconoCheck />,
        titulo: "Confirmar envío",
        cuerpo: "Vas a enviar $250.000 a $mariarojas.",
        cta: "Confirmar",
        ctaTone: "default",
      },
      {
        id: "destructivo",
        tone: "danger",
        icono: <IconoPapelera />,
        titulo: "Eliminar bolsillo",
        cuerpo: "Se perderá el historial de este bolsillo. No se puede deshacer.",
        cta: "Eliminar",
        ctaTone: "danger",
      },
      {
        id: "informativo",
        tone: "info",
        icono: <IconoInfo />,
        titulo: "Actualiza la app",
        cuerpo: "Hay una versión nueva con mejoras de seguridad.",
        cta: "Actualizar",
        ctaTone: "default",
      },
    ] as const;

    return (
      <div className="flex flex-wrap gap-6">
        {variantes.map((v) => (
          <Especimen key={v.id} etiqueta={v.id}>
            {(container) => (
              <Modal open modal={false}>
                <ModalContent
                  container={container}
                  overlayClassName="absolute p-4"
                  // Espécimen estático: no roba el foco de la página ni se
                  // cierra al interactuar con el resto de la matriz.
                  onOpenAutoFocus={(event: Event) => event.preventDefault()}
                  onInteractOutside={(event: Event) => event.preventDefault()}
                  onEscapeKeyDown={(event: KeyboardEvent) => event.preventDefault()}
                >
                  <ModalIcon tone={v.tone}>{v.icono}</ModalIcon>
                  <ModalTitle>{v.titulo}</ModalTitle>
                  <ModalDescription>{v.cuerpo}</ModalDescription>
                  <ModalFooter>
                    <ModalAction tone={v.ctaTone}>{v.cta}</ModalAction>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
          </Especimen>
        ))}
      </div>
    );
  },
};

/** Caja que hace de viewport para un espécimen portalado. */
function Especimen({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: (container: HTMLDivElement | null) => React.ReactNode;
}) {
  // Callback ref en estado: el portal necesita el nodo ya montado, y una ref
  // normal no provoca el segundo render que lo entrega.
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">
        {etiqueta}
      </span>
      <div
        ref={setContainer}
        className="relative h-[340px] w-[300px] overflow-hidden rounded-xl border border-edge bg-page"
      >
        {children(container)}
      </div>
    </div>
  );
}
