import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton, Link } from "./link";

/* Seccion 06 · Links e icon buttons.
 *
 * Las stories de IconButton usan glifos SVG dibujados aqui SOLO como relleno de
 * demostracion: el sistema usa Phosphor Icons y este paquete no depende de
 * phosphor-react. En producto se pasa el glifo real como children. */

const Glifo = ({ d }: { d: string }) => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d={d} />
  </svg>
);

const iconos = {
  // qr-code, funnel, plus, arrow-up, trash — trazados simplificados.
  qr: "M104 40H48a8 8 0 00-8 8v56a8 8 0 008 8h56a8 8 0 008-8V48a8 8 0 00-8-8zm-8 56H56V56h40zm112-56h-56a8 8 0 00-8 8v56a8 8 0 008 8h56a8 8 0 008-8V48a8 8 0 00-8-8zm-8 56h-40V56h40zM104 144H48a8 8 0 00-8 8v56a8 8 0 008 8h56a8 8 0 008-8v-56a8 8 0 00-8-8zm-8 56H56v-40h40zm56-56a8 8 0 008-8v-16h32v16a8 8 0 0016 0v-16h8a8 8 0 000-16h-64a8 8 0 00-8 8v24a8 8 0 008 8zm64 24a8 8 0 00-8 8v40h-40v-40a8 8 0 00-16 0v48a8 8 0 008 8h56a8 8 0 008-8v-48a8 8 0 00-8-8z",
  filtro:
    "M228 56a12 12 0 01-12 12H40a12 12 0 010-24h176a12 12 0 0112 12zm-40 60H68a12 12 0 000 24h120a12 12 0 000-24zm-40 60h-40a12 12 0 000 24h40a12 12 0 000-24z",
  mas: "M228 128a12 12 0 01-12 12h-76v76a12 12 0 01-24 0v-76H40a12 12 0 010-24h76V40a12 12 0 0124 0v76h76a12 12 0 0112 12z",
  arriba:
    "M208.5 120.5a12 12 0 01-17 0L140 69v147a12 12 0 01-24 0V69l-51.5 51.5a12 12 0 01-17-17l72-72a12 12 0 0117 0l72 72a12 12 0 010 17z",
  papelera:
    "M216 48h-40v-8a24 24 0 00-24-24h-48a24 24 0 00-24 24v8H40a12 12 0 000 24h4v136a20 20 0 0020 20h128a20 20 0 0020-20V72h4a12 12 0 000-24zM104 40a1 1 0 011-1h46a1 1 0 011 1v8h-48zm84 168H68V72h120zm-72-96v64a12 12 0 01-24 0v-64a12 12 0 0124 0zm48 0v64a12 12 0 01-24 0v-64a12 12 0 0124 0z",
} as const;

/* ------------------------------------------------------------------ *
 * Link
 * ------------------------------------------------------------------ */

const meta = {
  title: "Componentes/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 06 · Links e icon buttons — CANONICO** (del archivo de Figma).",
          "",
          "El link **lleva a otro lugar** y va SIEMPRE subrayado: el color nunca puede ser la unica señal.",
          "Nunca ejecuta acciones destructivas ni de envio — para eso esta el boton.",
          "",
          "Tres tipos:",
          "",
          "- **inline** — dentro de un parrafo. Hereda la familia del cuerpo (Ubuntu Sans 500), subrayado a offset 2.",
          "- **action** — suelto. Mono, MAYUSCULAS por CSS, +2% de tracking. Para *ver todo*, *editar*, *cambiar*.",
          "- **external** — lleva flecha ↗ cuando sale de Tikin o abre en otra pestaña.",
          "",
          "Estados: default tinta 900 · hover 700 · pressed 900 con subrayado 2px · disabled 500 sin pointer.",
          "El subrayado nunca desaparece.",
          "",
          "> El hover baja a `--tk-700` y no a `--link-text-hover`: en Figma ese token es identico al de default,",
          "> asi que el hover no daria ninguna respuesta visible.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["inline", "action", "external"] },
    disabled: { control: "boolean" },
  },
  args: { children: "Ver todos los movimientos", href: "#links" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dentro de un parrafo. Hereda tamaño y familia del texto que lo rodea. */
export const Inline: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="max-w-[420px] text-sm leading-relaxed text-ink">
      Al continuar aceptas los <Link href="#links">términos y condiciones</Link> y la{" "}
      <Link href="#links">política de datos</Link>.
    </p>
  ),
};

/** Fuera de un parrafo: mono, MAYUSCULAS, +2%. */
export const Accion: Story = {
  name: "Acción",
  args: { variant: "action" },
};

/** Flecha ↗ cuando sale de Tikin o abre en otra pestaña. */
export const Externo: Story = {
  args: { variant: "external", children: "Centro de ayuda", target: "_blank" },
  parameters: {
    docs: {
      description: {
        story:
          'Con `target="_blank"` el componente añade `rel="noopener noreferrer"` y un aviso solo para lector de pantalla.',
      },
    },
  },
};

/** Baja a neutral-500 y pierde el pointer, nunca el subrayado. */
export const Deshabilitado: Story = {
  args: { variant: "action", disabled: true },
  parameters: {
    docs: {
      description: {
        story: [
          "Se retira el `href`: el navegador deja de navegar y el elemento sale del orden de tabulacion.",
          'Como un `<a>` sin href tampoco tiene rol, se declara `role="link"` junto a `aria-disabled`,',
          "para que el lector de pantalla siga anunciando que hay una accion apagada — sobre un elemento",
          "generico, `aria-disabled` no lo expone nadie.",
          "",
          "Con `asChild` el href lo pone el consumidor y Slot le da prioridad, asi que ahi el bloqueo son",
          "`aria-disabled`, `tabIndex=-1` y el corte del click en fase de captura (Slot llama antes al",
          "`onClick` del hijo que al nuestro).",
        ].join("\n"),
      },
    },
  },
};

/** default 900 · hover 700 · pressed 900 + subrayado 2px · disabled 500 */
export const MatrizDeEstadosDelLink: Story = {
  name: "Matriz de estados",
  parameters: { controls: { disable: true } },
  render: () => (
    <table className="tk-static border-separate border-spacing-4 rounded-lg bg-surface p-4">
      <thead>
        <tr>
          {["", "default", "hover", "pressed", "disabled"].map((h) => (
            <th
              key={h}
              className="text-left font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase">acción</td>
          <td>
            <Link variant="action" href="#links">
              Ver todo
            </Link>
          </td>
          {/* hover y pressed no se pueden forzar sin CSS: se muestran con la
              tinta que les corresponde para que la matriz sirva de referencia. */}
          <td>
            <Link variant="action" href="#links" className="text-ink-700">
              Ver todo
            </Link>
          </td>
          <td>
            <Link variant="action" href="#links" className="text-ink-strong [&>span]:decoration-2">
              Ver todo
            </Link>
          </td>
          <td>
            <Link variant="action" disabled>
              Ver todo
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

/** Navegacion textual: "ver todos", pie legal, cambiar de seccion. */
export const EnContexto: Story = {
  name: "En contexto · pie y filas",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[340px] flex-col gap-3 rounded-xl border border-edge bg-page p-4">
      <div className="flex items-center justify-between">
        <span className="font-display text-[15px] font-medium text-ink">Últimos movimientos</span>
        <Link variant="action" href="#links" className="text-xs">
          Ver todos
        </Link>
      </div>
      <div className="h-px bg-edge" />
      <p className="text-[12.5px] leading-relaxed text-ink-700">
        Al enviar aceptas los <Link href="#links">términos</Link>.
      </p>
    </div>
  ),
};

/* ------------------------------------------------------------------ *
 * IconButton
 * ------------------------------------------------------------------ */

type IconButtonStory = StoryObj<typeof IconButton>;

/**
 * **EXTENSION** — la matriz de jerarquias del icon button no viene del archivo
 * de Figma: se propone con los tokens del sistema. La escala 44/40/32 y los
 * radios 12/10/8 si estan respaldados (el escalon de 32 coincide con
 * CalendarArrowButton, que es del archivo).
 */
export const IconButtonJerarquias: IconButtonStory = {
  name: "IconButton · jerarquías",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: [
          "**EXTENSION construida con los tokens**, no especificacion aprobada.",
          "El archivo de Figma no exporta un icon button generico: solo piezas concretas",
          "(flechas de calendario 32, stroked select/down) y el set de glifos.",
          "",
          "Todo icon button lleva `label` con el verbo de la accion — es obligatorio,",
          "un boton de solo glifo sin nombre accesible no existe para un lector de pantalla.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton label="Escanear QR">
        <Glifo d={iconos.qr} />
      </IconButton>
      <IconButton label="Filtrar" variant="outline">
        <Glifo d={iconos.filtro} />
      </IconButton>
      <IconButton label="Añadir" variant="solid">
        <Glifo d={iconos.mas} />
      </IconButton>
      <IconButton label="Enviar" variant="solid" shape="round">
        <Glifo d={iconos.arriba} />
      </IconButton>
      <IconButton label="Eliminar" variant="destructive">
        <Glifo d={iconos.papelera} />
      </IconButton>
    </div>
  ),
};

/** 44 · glifo 20 · r12 | 40 · glifo 18 · r10 | 32 · glifo 16 · r8 */
export const IconButtonTamanos: IconButtonStory = {
  name: "IconButton · tamaños",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: [
          "Por debajo de 44 el area tactil se amplia con un pseudoelemento, sin mover la caja visible.",
          "La ampliacion es de 2px por lado —la mitad del gap minimo de 4 que manda la seccion—, asi que",
          "dos vecinos como mucho se tocan y nunca se roban el click: en `m` eso deja el target en 44 y en",
          "`s` en 36.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-7">
      {(["l", "m", "s"] as const).map((size, i) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconButton label="Notificaciones" variant="outline" size={size}>
            <Glifo d={iconos.filtro} />
          </IconButton>
          <span className="font-meta text-[10px] text-ink-600">
            {["44 · glifo 20 · r12", "40 · glifo 18 · r10", "32 · glifo 16 · r8"][i]}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** El punto rojo de 6 marca estado activo — por ejemplo, filtro aplicado. */
export const IconButtonBadge: IconButtonStory = {
  name: "IconButton · badge",
  parameters: { controls: { disable: true } },
  render: () => (
    <IconButton label="Filtrar" badge>
      <Glifo d={iconos.filtro} />
    </IconButton>
  ),
};

/** Deshabilitado por jerarquia. Nunca opacidad sobre el boton entero. */
export const IconButtonDeshabilitado: IconButtonStory = {
  name: "IconButton · deshabilitado",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton label="Escanear QR" disabled>
        <Glifo d={iconos.qr} />
      </IconButton>
      <IconButton label="Filtrar" variant="outline" disabled>
        <Glifo d={iconos.filtro} />
      </IconButton>
      <IconButton label="Añadir" variant="solid" disabled>
        <Glifo d={iconos.mas} />
      </IconButton>
      <IconButton label="Eliminar" variant="destructive" disabled>
        <Glifo d={iconos.papelera} />
      </IconButton>
    </div>
  ),
};

/** Matriz de especificacion: jerarquias x estados, congelada en tema claro. */
export const IconButtonMatriz: IconButtonStory = {
  name: "IconButton · matriz de especificación",
  parameters: { controls: { disable: true } },
  render: () => {
    const filas = [
      { variant: "ghost", nota: "bg transp.", glifo: iconos.qr, shape: "square" },
      { variant: "outline", nota: "secundario", glifo: iconos.filtro, shape: "square" },
      { variant: "solid", nota: "primario", glifo: iconos.mas, shape: "square" },
      { variant: "solid", nota: "primario ○", glifo: iconos.arriba, shape: "round" },
      { variant: "destructive", nota: "eliminar", glifo: iconos.papelera, shape: "square" },
    ] as const;

    return (
      <table className="tk-static border-separate border-spacing-4 rounded-lg bg-surface p-4">
        <thead>
          <tr>
            {["", "default", "disabled"].map((h) => (
              <th
                key={h}
                className="text-left font-meta text-[11px] tracking-[0.1em] text-ink-600 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={`${fila.variant}-${fila.shape}`}>
              <td className="font-meta text-[11px] tracking-[0.1em] text-ink-600">
                {fila.variant} · {fila.nota}
              </td>
              {[false, true].map((disabled) => (
                <td key={String(disabled)}>
                  <IconButton
                    label={fila.variant}
                    variant={fila.variant}
                    shape={fila.shape}
                    disabled={disabled}
                  >
                    <Glifo d={fila.glifo} />
                  </IconButton>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** Acciones sin espacio para texto: volver, buscar, filtrar. */
export const IconButtonEnAppBar: IconButtonStory = {
  name: "IconButton · app bar",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[340px] items-center gap-2.5 rounded-xl border border-edge bg-page px-3 py-3.5">
      <IconButton label="Volver" size="m">
        <Glifo d={iconos.arriba} />
      </IconButton>
      <span className="font-display text-base font-medium text-ink">Movimientos</span>
      <div className="ml-auto flex gap-1">
        <IconButton label="Buscar" size="m">
          <Glifo d={iconos.qr} />
        </IconButton>
        <IconButton label="Filtrar" size="m" badge>
          <Glifo d={iconos.filtro} />
        </IconButton>
      </div>
    </div>
  ),
};
