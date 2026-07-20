import { useId, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardFeature, CardMedia, CardStat } from "./card";

/* Seccion 10 · Cards — EXTENSION construida con los tokens del archivo.
 * No hay componente Card en el export de Figma: nada de lo que se ve aqui es
 * especificacion aprobada. Ver la cabecera de card.tsx. */

const meta = {
  title: "Componentes/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 10 · Cards — EXTENSION** (construida con los tokens del archivo, **no** es especificacion aprobada).",
          "",
          "El documento lo dice en su bajada: _Contenedores de informacion de la app. Extension construida con los tokens del archivo._ El export de Figma no trae ningun componente Card, asi que la geometria sale del prototipo y los colores de los tokens canonicos.",
          "",
          "Contenedor base: **radio 20 · padding 24 (movil 20) · borde 1 · shadow xs**. Sobre el, tres roles:",
          "",
          "- **feature** — presenta una funcion. Gris 100, icono 56 en tile blanco, titulo Funnel 22.",
          "- **media** — promocion con imagen a sangre, scrim, eyebrow glass y accion en la esquina.",
          "- **stat** — una metrica: label mono, delta con tendencia, cifra DM Mono 38 y sparkline.",
          "",
          "Superficies: blanco o gris 100 para contenido; tinta solo para la balance card. Nunca gradientes decorativos — el color entra por imagen real o por acento lima.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    surface: { control: "inline-radio", options: ["default", "muted", "ink"] },
    radius: { control: "inline-radio", options: ["sm", "md", "lg"] },
    padding: { control: "inline-radio", options: ["none", "sm", "md"] },
    interactive: { control: "boolean" },
  },
  args: {
    children: "Contenedor base — superficie, borde 1px y radio del sistema.",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Utilidades solo para las stories                                     */
/* ------------------------------------------------------------------ */

/* Iconos en linea: el paquete no depende de ninguna libreria de iconos, y las
   stories no pueden introducir dependencias. En producto van los Phosphor. */
const IconoCartera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a1 1 0 0 1 1 1v2" strokeLinecap="round" />
    <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
    <circle cx="16" cy="13.5" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const IconoTendencia = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 17 9 11l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconoTendenciaBaja = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 7 9 13l4-4 8 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 17h6v-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconoTendenciaPlana = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 12h16" strokeLinecap="round" />
  </svg>
);

const IconoAbrir = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Marca el hueco de la imagen sin inventarse un gradiente decorativo. */
const ImagenDemo = () => (
  <div className="flex size-full items-center justify-center bg-surface-3">
    {/* ink-700 y no ink-600: sobre surface-3, que ya es un gris, el 600 se
        queda en 4.39:1 — a 0.11 del minimo AA. */}
    <span className="font-meta text-[11px] tracking-[0.1em] text-ink-700 uppercase">
      Imagen de marca
    </span>
  </div>
);

/** Sparkline del documento: relleno lima que se desvanece + linea en tinta. */
const Sparkline = () => {
  /* El id del gradiente tiene que ser unico por instancia: las stories Stat y
     Tres tipos conviven en la misma pagina de autodocs, y dos <linearGradient>
     con el mismo id son HTML invalido — el navegador resuelve `url(#...)`
     contra el primero que encuentre, asi que el relleno del segundo sparkline
     depende del orden de montaje. */
  const idRelleno = useId();
  return (
    <svg viewBox="0 0 240 72" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={idRelleno} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,58 L26,52 L52,55 L78,44 L104,47 L130,36 L156,39 L182,26 L208,22 L240,12 L240,72 L0,72 Z"
        fill={`url(#${idRelleno})`}
      />
      <path
        d="M0,58 L26,52 L52,55 L78,44 L104,47 L130,36 L156,39 L182,26 L208,22 L240,12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Etiqueta = ({ children }: { children: ReactNode }) => (
  <span className="font-meta text-[10px] tracking-[0.06em] text-ink-600 uppercase">{children}</span>
);

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

export const Base: Story = {
  render: (args) => (
    <div className="w-[320px]">
      <Card {...args} />
    </div>
  ),
};

/** Gris 100 cuando la tarjeta va sobre blanco. Nunca dos blancos sin borde. */
export const Superficies: Story = {
  name: "Superficies",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <Etiqueta>default · blanco + borde</Etiqueta>
      </Card>
      <Card surface="muted">
        <Etiqueta>muted · gris 100</Etiqueta>
      </Card>
      <Card surface="ink">
        <span className="font-meta text-[10px] tracking-[0.06em] uppercase opacity-60">
          ink · solo balance card
        </span>
      </Card>
    </div>
  ),
};

/** radio 20 por defecto; 16 en tarjetas densas, 24 en contenedores grandes. */
export const Radios: Story = {
  name: "Radios",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card radius="sm">
        <Etiqueta>sm · r16 · densa</Etiqueta>
      </Card>
      <Card radius="md">
        <Etiqueta>md · r20 · por defecto</Etiqueta>
      </Card>
      <Card radius="lg">
        <Etiqueta>lg · r24 · contenedor grande</Etiqueta>
      </Card>
    </div>
  ),
};

/**
 * Reposo shadow xs → hover shadow md + lift 2 → pressed hueso sin sombra.
 * La sombra nunca reemplaza al borde.
 */
export const Tocable: Story = {
  name: "Tocable",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Pasa el raton y luego mantén pulsado para ver los tres estados. Sin `asChild` la tarjeta recibe `role="button"`, foco y Enter/Espacio; con `asChild` la semantica la pone el elemento del consumidor, que es lo preferible.',
      },
    },
  },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card interactive radius="sm" className="flex-row items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-md bg-surface-2 [&_svg]:size-[18px]">
          <IconoCartera />
        </span>
        <span className="font-display text-[15px] font-medium">Mi bolsillo</span>
      </Card>
      <Card asChild interactive radius="sm" className="flex-row items-center gap-3">
        <a href="#bolsillos">
          <span className="flex size-9 items-center justify-center rounded-md bg-surface-2 [&_svg]:size-[18px]">
            <IconoCartera />
          </span>
          <span className="font-display text-[15px] font-medium">Como enlace (asChild)</span>
        </a>
      </Card>
    </div>
  ),
};

/** Superficie gris 100 · icono 56 en tile blanco · titulo Funnel 22 · desc 15. */
export const Feature: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[300px]">
      <CardFeature
        icon={<IconoCartera />}
        title="Bolsillos"
        description="Aparta plata para cada meta, con su saldo y su propio TikinTAG para recibir aportes."
      />
    </div>
  ),
};

/** Imagen a sangre + scrim inferior · eyebrow glass · accion ↗ · titulo claro. */
export const Media: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: [
          "La media card congela el tema dentro de si misma (`.tk-static`, igual que el documento en este bloque) porque su fondo no es una superficie de la interfaz sino una fotografia, y una fotografia no se invierte cuando la pagina pasa a oscuro.",
          "",
          "Gracias a eso el color sigue siendo semantico: `bg-ink` es siempre el fondo oscuro y `text-surface` la tinta clara que se lee encima. Para los hijos que pase quien la usa, dentro de esta tarjeta `surface` significa _encima de la foto_ e `ink` significa _la foto_.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="w-[300px]">
      <CardMedia
        image={<ImagenDemo />}
        eyebrow="Tarjeta · Tikin"
        title="Tu tarjeta física"
        description="Pídela sin costo y paga en cualquier datáfono del país."
        action={<IconoAbrir />}
        actionLabel="Ver detalle de la tarjeta"
      />
    </div>
  ),
};

/** El caso que rompia: sin imagen el fondo es el unico soporte del texto. */
export const MediaSinImagen: Story = {
  name: "Media sin imagen",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Sin imagen —o mientras carga— el fondo de tinta es lo unico que sostiene el contraste del overlay. Las dos muestras deben verse identicas: la de la izquierda hereda el tema de la pagina, la de la derecha esta forzada a oscuro.",
      },
    },
  },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="w-[300px]">
        <CardMedia
          eyebrow="Tarjeta · Tikin"
          title="Tu tarjeta física"
          description="Pídela sin costo y paga en cualquier datáfono del país."
          action={<IconoAbrir />}
          actionLabel="Ver detalle de la tarjeta"
        />
      </div>
      {/* Fuerza el tema oscuro solo en esta rama para poder comparar las dos
          lado a lado sin depender del selector global de Storybook. */}
      <div className="dark w-[300px] bg-page">
        <CardMedia
          eyebrow="Tarjeta · Tikin"
          title="Tu tarjeta física"
          description="Pídela sin costo y paga en cualquier datáfono del país."
          action={<IconoAbrir />}
          actionLabel="Ver detalle de la tarjeta"
        />
      </div>
    </div>
  ),
};

/** Label mono · delta + tendencia · cifra DM Mono 38 · comparacion + sparkline. */
export const Stat: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[300px]">
      <CardStat
        label="Ahorro del mes"
        value="$ 480.000"
        delta="12.4%"
        trend="up"
        trendIcon={<IconoTendencia />}
        comparison="vs $ 427.000 el mes pasado"
        chart={<Sparkline />}
      />
    </div>
  ),
};

/** La pildora colorea la tendencia; el signo lo escribe quien usa el componente. */
export const Tendencias: Story = {
  name: "Tendencias del stat",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'El color de la pildora nunca es el unico portador de la tendencia: el componente añade un texto solo-lector ("al alza", "a la baja", "sin cambio") delante del delta, y la muestra acompaña cada caso de su icono para quien no distinga verde de rojo. Se puede sustituir con `trendLabel`, o silenciar con `trendLabel=""` cuando el delta ya lo dice con palabras.',
      },
    },
  },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <CardStat
        label="Ahorro"
        value="$ 480.000"
        delta="12.4%"
        trend="up"
        trendIcon={<IconoTendencia />}
        comparison="vs $ 427.000"
      />
      <CardStat
        label="Gastos"
        value="$ 312.000"
        delta="8.1%"
        trend="down"
        trendIcon={<IconoTendenciaBaja />}
        comparison="vs $ 289.000"
      />
      <CardStat
        label="Cuotas"
        value="$ 90.000"
        delta="0.0%"
        trend="flat"
        trendIcon={<IconoTendenciaPlana />}
        comparison="sin cambios"
      />
    </div>
  ),
};

/** Los tres roles del documento, uno al lado del otro. */
export const TresTipos: Story = {
  name: "Tres tipos principales",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CardFeature
        icon={<IconoCartera />}
        title="Bolsillos"
        description="Aparta plata para cada meta, con su saldo y su propio TikinTAG para recibir aportes."
      />
      <CardMedia
        image={<ImagenDemo />}
        eyebrow="Tarjeta · Tikin"
        title="Tu tarjeta física"
        description="Pídela sin costo y paga en cualquier datáfono del país."
        action={<IconoAbrir />}
        actionLabel="Ver detalle de la tarjeta"
      />
      <CardStat
        label="Ahorro del mes"
        value="$ 480.000"
        delta="12.4%"
        trend="up"
        trendIcon={<IconoTendencia />}
        comparison="vs $ 427.000 el mes pasado"
        chart={<Sparkline />}
      />
    </div>
  ),
};

/** Matriz de especificacion: superficie × radio, con el tema claro congelado. */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const surfaces = ["default", "muted", "ink"] as const;
    const radios = [
      ["sm", "r16"],
      ["md", "r20"],
      ["lg", "r24"],
    ] as const;
    return (
      // .tk-static congela el tema claro, igual que hace el documento en sus
      // matrices: una muestra de especificacion debe verse siempre igual.
      <div className="tk-static bg-page p-6">
        <table className="border-separate border-spacing-3">
          <thead>
            <tr>
              <th />
              {surfaces.map((s) => (
                <th
                  key={s}
                  className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase"
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {radios.map(([radius, etiqueta]) => (
              <tr key={radius}>
                <td className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">
                  {etiqueta}
                </td>
                {surfaces.map((s) => (
                  <td key={s}>
                    <Card surface={s} radius={radius} padding="sm" className="w-[180px]">
                      <span className="font-meta text-[10px] tracking-[0.06em] uppercase opacity-70">
                        {s} · {etiqueta}
                      </span>
                    </Card>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};
