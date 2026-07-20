import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banner, BannerAction } from "./banner";

const meta = {
  title: "Componentes/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 38 · Banners — EXTENSION** construida con la paleta del sistema.",
          "",
          "El documento la etiqueta explicitamente como extension y el export de Figma lo confirma: no existe ningun cuerpo de Banner en `docs/figma-export/components/`. Estas medidas vienen del prototipo del documento, **no son especificacion aprobada del archivo**.",
          "",
          "- **Banner vs alert** — el banner es global y de ancho completo, anclado arriba de la app; el alert vive dentro de una tarjeta o de un formulario.",
          "- **Uno a la vez** — solo un banner activo. Promo en tinta con CTA en pill claro; info en lavanda; exito en verde; sistema en ambar; critico en rojo.",
          "- **Accion + cerrar** — una sola accion (pill en tinta, subrayada en los tonos claros; nunca texto verde) y la X para descartar.",
          '- **Critico se fija** — los avisos criticos o bloqueantes no llevan X y permanecen hasta resolverse. La regla se aplica en codigo: con `tone="critical"` la X no se pinta aunque se pase `onDismiss`.',
          "",
          'El rol ARIA sale del tono: `critical` usa `role="alert"` (asertivo, interrumpe al lector de pantalla) y el resto `role="status"`. Un banner suele estar ya presente al cargar la pantalla, asi que interrumpir por una promo seria ruido. Se puede sobreescribir con la prop `role`.',
          "",
          "Por defecto va **borde a borde** (sin radio). `rounded` le da radio 12 para cuando se muestra dentro de un contenedor, que es como lo dibujan los ejemplos de la seccion.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["promo", "info", "success", "system", "critical", "neutral"],
    },
    description: { control: "text" },
    rounded: { control: "boolean" },
    hideIcon: { control: "boolean" },
    loading: { control: "boolean" },
    dismissLabel: { control: "text" },
    icon: { control: false },
    action: { control: false },
    onDismiss: { control: false },
  },
  args: { children: "Tu tarjeta física Tikin ya está disponible." },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tinta con icono lima y CTA en pill claro. Nunca texto verde. */
export const Promo: Story = {
  args: {
    tone: "promo",
    action: <BannerAction>Pedir</BannerAction>,
    onDismiss: () => {},
  },
};

/** Lavanda. Avisos que el usuario no tiene que resolver ahora mismo. */
export const Info: Story = {
  args: {
    tone: "info",
    children: "Actualizamos nuestros términos de servicio.",
    action: <BannerAction>Leer</BannerAction>,
    onDismiss: () => {},
  },
};

/** Verde. Algo salió bien y sigue siendo relevante al abrir la app. */
export const Exito: Story = {
  name: "Éxito",
  args: {
    tone: "success",
    children: "Tu tarjeta física llegó. Actívala para empezar a usarla.",
    action: <BannerAction>Activar</BannerAction>,
    onDismiss: () => {},
  },
};

/** Ámbar. Estado del servicio: mantenimientos, demoras, incidencias. */
export const Sistema: Story = {
  args: {
    tone: "system",
    children: "Mantenimiento programado hoy 11 PM – 12 AM. Algunos envíos podrían demorarse.",
  },
};

/** Rojo y bloqueante: sin X, se queda hasta que se resuelva. */
export const Critico: Story = {
  name: "Crítico",
  args: {
    tone: "critical",
    children: "Verifica tu identidad para seguir enviando dinero.",
    action: <BannerAction>Verificar</BannerAction>,
    // Se pasa a proposito para demostrar que el componente lo ignora.
    onDismiss: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Esta story pasa `onDismiss` a proposito: el componente lo ignora en `critical`. Un aviso bloqueante que se puede cerrar deja de ser bloqueante.",
      },
    },
  },
};

/** Formato "progreso": tono neutro y spinner en vez de icono. `aria-busy`. */
export const Progreso: Story = {
  args: { tone: "neutral", loading: true, children: "Sincronizando tus movimientos…" },
};

/** Formato "doble línea": mensaje arriba, detalle en tinta apagada debajo. */
export const DobleLinea: Story = {
  name: "Doble línea",
  args: {
    tone: "system",
    children: "Tu cuenta tiene un pago pendiente.",
    description: "Regulariza antes del 30 de julio para evitar bloqueos.",
    action: <BannerAction>Pagar</BannerAction>,
    onDismiss: () => {},
  },
};

/** Con radio 12, para cuando el banner se muestra dentro de un contenedor. */
export const ConRadio: Story = {
  name: "Con radio",
  args: {
    rounded: true,
    action: <BannerAction>Pedir</BannerAction>,
    onDismiss: () => {},
  },
};

/**
 * El Banner no gestiona su propia visibilidad: `onDismiss` solo avisa. Quien lo
 * usa decide si desaparece, si se puede volver a mostrar o si vuelve al
 * recargar — igual que el bloque en vivo del documento, que ofrece MOSTRAR DE
 * NUEVO.
 */
export const EnVivo: Story = {
  name: "En vivo · descartable",
  parameters: { controls: { disable: true } },
  render: function EnVivo() {
    const [visible, setVisible] = React.useState(true);

    return (
      <div className="w-[640px] max-w-full overflow-hidden rounded-xl border border-edge">
        {visible ? (
          <Banner
            action={<BannerAction onClick={() => setVisible(false)}>Pedir</BannerAction>}
            onDismiss={() => setVisible(false)}
          >
            Tu tarjeta física Tikin ya está disponible.
          </Banner>
        ) : (
          <div className="flex items-center justify-center gap-2.5 bg-page p-4">
            <span className="text-[13px] text-ink-600">Banner descartado.</span>
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="h-[30px] cursor-pointer rounded-sm border border-edge-2 px-3.5 font-mono text-xs tracking-[0.02em] text-ink uppercase hover:bg-surface-2"
            >
              Mostrar de nuevo
            </button>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Uno a la vez: el banner se ancla arriba del todo, por encima de la cabecera y
 * a hueso con los bordes de la pantalla. Si hay dos avisos que dar, el segundo
 * espera o baja a `Alert`.
 */
export const AncladoArriba: Story = {
  name: "Anclado arriba",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[390px] max-w-full overflow-hidden rounded-xl border border-edge bg-page">
      <Banner action={<BannerAction>Ver</BannerAction>} onDismiss={() => {}}>
        Cashback de Navidad — termina en 2 días.
      </Banner>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="font-display text-lg font-semibold text-ink">Inicio</span>
        <span className="font-num text-sm text-ink-600 tabular-nums">$1.240.000</span>
      </div>
      <div className="mx-5 mb-5 h-28 rounded-lg bg-surface" />
    </div>
  ),
};

/** Matriz de especificacion: los cinco tipos del documento mas el neutro. */
export const MatrizDeTonos: Story = {
  name: "Matriz de tonos",
  parameters: { controls: { disable: true } },
  render: () => (
    // .tk-static congela el tema claro, igual que hace el documento en sus
    // matrices: las muestras deben verse siempre igual.
    <div className="tk-static flex w-[640px] max-w-full flex-col gap-3 bg-surface p-6">
      <Banner
        rounded
        tone="promo"
        action={<BannerAction>Invitar</BannerAction>}
        onDismiss={() => {}}
      >
        Invita a un amigo y ambos reciben $20.000.
      </Banner>
      <Banner rounded tone="info" action={<BannerAction>Leer</BannerAction>} onDismiss={() => {}}>
        Actualizamos nuestros términos de servicio.
      </Banner>
      <Banner
        rounded
        tone="success"
        action={<BannerAction>Activar</BannerAction>}
        onDismiss={() => {}}
      >
        Tu tarjeta física llegó. Actívala para empezar a usarla.
      </Banner>
      <Banner rounded tone="system">
        Mantenimiento programado hoy 11 PM – 12 AM. Algunos envíos podrían demorarse.
      </Banner>
      <Banner rounded tone="critical" action={<BannerAction>Verificar</BannerAction>}>
        Verifica tu identidad para seguir enviando dinero.
      </Banner>
      <Banner rounded tone="neutral" loading>
        Sincronizando tus movimientos…
      </Banner>
    </div>
  ),
};

/**
 * Un mensaje largo se parte dentro del banner en vez de desbordarlo: la columna
 * de texto lleva `min-w-0`, que es lo que permite a un hijo flex encogerse por
 * debajo de su ancho de contenido.
 */
export const TextoLargo: Story = {
  name: "Texto largo",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[360px] max-w-full">
      <Banner
        rounded
        tone="system"
        description="Regulariza antes del 30 de julio para evitar bloqueos en los envíos y en la tarjeta."
        action={<BannerAction>Pagar</BannerAction>}
        onDismiss={() => {}}
      >
        Tu cuenta tiene un pago pendiente desde el mes pasado.
      </Banner>
    </div>
  ),
};
