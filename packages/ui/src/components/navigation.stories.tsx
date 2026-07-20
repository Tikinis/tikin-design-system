import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sidebar,
  SidebarFooter,
  SidebarItem,
  SidebarUser,
  TabBar,
  TabBarAction,
  TabBarItem,
  TopBar,
  TopBarAction,
  TopBarLink,
} from "./navigation";

/* Iconos de Phosphor (viewBox 256) copiados a mano: el paquete
 * @phosphor-icons/react no es dependencia de packages/ui y estas stories no
 * pueden añadirla. En una app real llegan como `<House />` y `<House
 * weight="fill" />`. */
type IconProps = React.SVGProps<SVGSVGElement>;
const Ph = ({ d, ...props }: IconProps & { d: string }) => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <path d={d} />
  </svg>
);

const HOUSE =
  "M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z";
const LIST =
  "M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z";
const WALLET =
  "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z";
const GIFT =
  "M216,72H180.92c.39-.33.79-.65,1.17-1A29.53,29.53,0,0,0,192,49.57,32.62,32.62,0,0,0,158.44,16,29.53,29.53,0,0,0,137,25.91a54.94,54.94,0,0,0-9,14.48,54.94,54.94,0,0,0-9-14.48A29.53,29.53,0,0,0,97.56,16,32.62,32.62,0,0,0,64,49.57,29.53,29.53,0,0,0,73.91,71c.38.33.78.65,1.17,1H40A16,16,0,0,0,24,88v32a16,16,0,0,0,16,16v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM149,36.51a13.69,13.69,0,0,1,10-4.5h.49A16.62,16.62,0,0,1,176,49.08a13.69,13.69,0,0,1-4.5,10c-9.49,8.4-25.24,11.36-35,12.4C137.7,60.89,141,45.5,149,36.51Zm-64.09.36A16.63,16.63,0,0,1,96.59,32h.49a13.69,13.69,0,0,1,10,4.5c8.39,9.48,11.35,25.2,12.39,34.92-9.72-1-25.44-4-34.92-12.39a13.69,13.69,0,0,1-4.5-10A16.6,16.6,0,0,1,84.87,36.87ZM40,88h80v32H40Zm16,48h64v64H56Zm144,64H136V136h64Zm16-80H136V88h80v32Z";
const CARD =
  "M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64ZM224,192H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z";
const QUESTION =
  "M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z";
const BELL =
  "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z";
const SEARCH =
  "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z";
const ARROW_UP =
  "M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z";
const HELP = QUESTION;

/* Version rellena de la casa, para el destino activo de la barra inferior. */
const HOUSE_FILL =
  "M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z";

const meta = {
  title: "Componentes/Navigation",
  component: TabBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "**Seccion 26 · Navigation — EXTENSION** (construida con los tokens del archivo, NO especificacion aprobada).",
          "",
          "El documento lo dice literalmente en su entradilla. Ninguno de estos componentes existe como nodo en el archivo de Figma: son una propuesta coherente montada sobre los tokens `--tk-*`. No los cites como canonicos.",
          "",
          "- **TabBar** — barra inferior de la app movil. Maximo 4 destinos mas la accion central de envio, elevada y en tinta. Activo relleno (`ph-fill`) en tinta, inactivo en gris 500.",
          "- **TopBar** — app bar superior. En flujos: volver + titulo + accion. En pantallas raiz: saludo, campana y titulo grande en Funnel. En web: logo + links + buscar/campana/avatar.",
          "- **Sidebar** — rail de 220 del dashboard de dispersion. Activo en tinta invertida r10, hover gris 100, contador lima, usuario abajo.",
          "",
          "La barra inferior acompaña a las pantallas raiz; en flujos modales se oculta y arriba solo queda el back.",
          "",
          "Ni la app bar ni el rail llevan borde ni radio: el marco que se ve en el documento es el chasis de la demo, no anatomia del componente.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Marco de telefono para que las barras moviles se lean en contexto. No forma
   parte de ningun componente. */
const Phone = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[380px] overflow-hidden rounded-2xl border border-edge bg-surface">
    {children}
  </div>
);

/* ------------------------------------------------------------------------- */
/* TabBar                                                                     */
/* ------------------------------------------------------------------------- */

const DESTINOS = [
  { id: "inicio", label: "Inicio", d: HOUSE, fill: HOUSE_FILL },
  { id: "movimientos", label: "Movimientos", d: LIST, fill: LIST },
  { id: "bolsillos", label: "Bolsillos", d: WALLET, fill: WALLET },
  { id: "bonos", label: "Bonos", d: GIFT, fill: GIFT },
];

/** Barra inferior completa: 4 destinos + la accion central de envio. */
export const BarraInferior: Story = {
  name: "TabBar · interactiva",
  parameters: {
    docs: {
      description: {
        story:
          "El destino activo lo decide quien consume — normalmente el router —, no la barra: asi no puede desfasarse respecto a la URL. La accion central sobresale 14px, asi que el contenedor no puede recortar.",
      },
    },
  },
  render: () => {
    const Demo = () => {
      const [activo, setActivo] = React.useState("inicio");
      return (
        // pt-8 deja sitio a los 14px que sobresale la accion central.
        <div className="w-[380px] rounded-2xl border border-edge bg-surface pt-8">
          <TabBar
            action={
              <TabBarAction label="Enviar dinero">
                <Ph d={ARROW_UP} />
              </TabBarAction>
            }
          >
            {DESTINOS.map((dst) => (
              <TabBarItem
                key={dst.id}
                icon={<Ph d={dst.d} />}
                activeIcon={<Ph d={dst.fill} />}
                label={dst.label}
                active={activo === dst.id}
                onClick={() => setActivo(dst.id)}
              />
            ))}
          </TabBar>
        </div>
      );
    };
    return <Demo />;
  },
};

/** Los destinos como enlaces reales, via `asChild`. */
export const BarraInferiorComoEnlaces: Story = {
  name: "TabBar · como enlaces (asChild)",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[380px] rounded-2xl border border-edge bg-surface pt-8">
      <TabBar
        action={
          <TabBarAction label="Enviar dinero">
            <Ph d={ARROW_UP} />
          </TabBarAction>
        }
      >
        {DESTINOS.map((dst, i) => (
          <TabBarItem
            key={dst.id}
            asChild
            icon={<Ph d={dst.d} />}
            activeIcon={<Ph d={dst.fill} />}
            label={dst.label}
            active={i === 0}
          >
            <a href={`#${dst.id}`} />
          </TabBarItem>
        ))}
      </TabBar>
    </div>
  ),
};

/* ------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* ------------------------------------------------------------------------- */

/** En un flujo: volver, titulo y una accion de apoyo. */
export const AppBarFlujo: Story = {
  name: "TopBar · flujo",
  parameters: { controls: { disable: true } },
  render: () => (
    <Phone>
      <TopBar
        title="Enviar dinero"
        onBack={() => {}}
        actions={
          <TopBarAction label="Ayuda">
            <Ph d={QUESTION} />
          </TopBarAction>
        }
      />
    </Phone>
  ),
};

/** En pantallas raiz: saludo, campana con aviso y titulo grande en Funnel. */
export const AppBarHome: Story = {
  name: "TopBar · home",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El punto rojo es decorativo: lo que hay sin leer va en el `label` del boton, o quien use lector de pantalla no se entera.",
      },
    },
  },
  render: () => (
    <Phone>
      <TopBar
        variant="home"
        greeting="Hola, Valentina"
        title="Inicio"
        actions={
          <TopBarAction label="Notificaciones, 3 sin leer" dot>
            <Ph d={BELL} />
          </TopBarAction>
        }
      />
    </Phone>
  ),
};

/** Escritorio: logo, links con subrayado en el activo y bloque derecho. */
export const NavWeb: Story = {
  name: "TopBar · web",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="overflow-hidden rounded-xl border border-edge">
      <TopBar
        variant="web"
        logo="tikin"
        actions={
          <>
            <TopBarAction size="s" label="Buscar" className="text-ink-600">
              <Ph d={SEARCH} />
            </TopBarAction>
            <TopBarAction size="s" label="Notificaciones, 3 sin leer" dot>
              <Ph d={BELL} />
            </TopBarAction>
            <span className="flex size-8 items-center justify-center rounded-full bg-lavender font-mono text-[11px] text-on-accent">
              VC
            </span>
          </>
        }
      >
        <TopBarLink href="#inicio" label="Inicio" active />
        <TopBarLink href="#movimientos" label="Movimientos" />
        <TopBarLink href="#bolsillos" label="Bolsillos" />
        <TopBarLink href="#bonos" label="Bonos" />
      </TopBar>
    </div>
  ),
};

/* ------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* ------------------------------------------------------------------------- */

/** Rail 220 del dashboard de dispersion, con contador y usuario abajo. */
export const RailLateral: Story = {
  name: "Sidebar",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El `SidebarFooter` se pega al fondo con `margin-top:auto`, asi que el rail necesita altura: dale `h-screen` o metelo en un contenedor estirado.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[380px] max-w-[720px] overflow-hidden rounded-xl border border-edge">
      <Sidebar brand="tikin">
        <SidebarItem icon={<Ph d={HOUSE_FILL} />} label="Inicio" active />
        <SidebarItem icon={<Ph d={LIST} />} label="Movimientos" />
        <SidebarItem icon={<Ph d={WALLET} />} label="Bolsillos" />
        <SidebarItem icon={<Ph d={GIFT} />} label="Bonos" badge={3} />
        <SidebarItem icon={<Ph d={CARD} />} label="Tarjeta" />
        <SidebarFooter>
          <SidebarItem icon={<Ph d={HELP} />} label="Ayuda" />
          <SidebarUser initials="VC" name="Valentina C." handle="$valentina" />
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col gap-4 bg-surface px-6 py-5">
        <div className="font-display text-[22px] font-semibold text-ink">Arriendo</div>
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-[70%] rounded-xs bg-surface-2" />
          <div className="h-2.5 w-[50%] rounded-xs bg-surface-2" />
          <div className="h-2.5 w-[60%] rounded-xs bg-surface-2" />
        </div>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------------- */
/* Matrices de especificacion                                                 */
/* ------------------------------------------------------------------------- */

const Fila = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="font-meta text-[11px] tracking-[0.1em] text-ink-500 uppercase">{titulo}</span>
    {children}
  </div>
);

/** Los dos estados de un destino, en las tres barras. */
export const MatrizDeEstados: Story = {
  name: "Matriz de estados",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Activo en tinta (relleno en la barra inferior, invertido en el rail, subrayado en la web); inactivo en gris 500 abajo y gris 700 en el rail.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <Fila titulo="TabBar · item">
        <div className="flex w-fit items-end gap-4 rounded-md bg-surface p-3">
          <TabBarItem
            icon={<Ph d={HOUSE} />}
            activeIcon={<Ph d={HOUSE_FILL} />}
            label="Activo"
            active
          />
          <TabBarItem icon={<Ph d={HOUSE} />} label="Inactivo" />
          <TabBarItem icon={<Ph d={HOUSE} />} label="Bloqueado" disabled />
        </div>
      </Fila>

      <Fila titulo="Sidebar · item">
        <div className="flex w-[220px] flex-col gap-1 rounded-md bg-page p-3">
          <SidebarItem icon={<Ph d={HOUSE_FILL} />} label="Activo" active />
          <SidebarItem icon={<Ph d={HOUSE} />} label="Inactivo" />
          <SidebarItem icon={<Ph d={GIFT} />} label="Con contador" badge={3} />
          <SidebarItem icon={<Ph d={CARD} />} label="Bloqueado" disabled />
        </div>
      </Fila>

      <Fila titulo="TopBar · link web">
        <div className="flex w-fit items-center gap-6 rounded-md bg-surface p-3">
          <TopBarLink href="#a" label="Activo" active />
          <TopBarLink href="#b" label="Inactivo" />
        </div>
      </Fila>

      <Fila titulo="TopBar · action">
        <div className="flex w-fit items-center gap-4 rounded-md bg-surface p-3">
          <TopBarAction label="M · 40">
            <Ph d={BELL} />
          </TopBarAction>
          <TopBarAction label="M · 40 con aviso" dot>
            <Ph d={BELL} />
          </TopBarAction>
          <TopBarAction size="s" label="S · 32">
            <Ph d={SEARCH} />
          </TopBarAction>
          <TopBarAction size="s" label="S · 32 con aviso" dot>
            <Ph d={BELL} />
          </TopBarAction>
          <TopBarAction label="Bloqueado" disabled>
            <Ph d={QUESTION} />
          </TopBarAction>
        </div>
      </Fila>
    </div>
  ),
};

/** Las tres formas de la app bar, una debajo de otra. */
export const MatrizDeAppBars: Story = {
  name: "Matriz de app bars",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <Fila titulo="flow · back + título + acción">
        <Phone>
          <TopBar
            title="Enviar dinero"
            onBack={() => {}}
            actions={
              <TopBarAction label="Ayuda">
                <Ph d={QUESTION} />
              </TopBarAction>
            }
          />
        </Phone>
      </Fila>

      <Fila titulo="home · saludo + campana + título grande">
        <Phone>
          <TopBar
            variant="home"
            greeting="Hola, Valentina"
            title="Inicio"
            actions={
              <TopBarAction label="Notificaciones, 3 sin leer" dot>
                <Ph d={BELL} />
              </TopBarAction>
            }
          />
        </Phone>
      </Fila>

      <Fila titulo="web · logo + links + acciones">
        <div className="overflow-hidden rounded-xl border border-edge">
          <TopBar
            variant="web"
            logo="tikin"
            actions={
              <>
                <TopBarAction size="s" label="Buscar" className="text-ink-600">
                  <Ph d={SEARCH} />
                </TopBarAction>
                <TopBarAction size="s" label="Notificaciones, 3 sin leer" dot>
                  <Ph d={BELL} />
                </TopBarAction>
                <span className="flex size-8 items-center justify-center rounded-full bg-lavender font-mono text-[11px] text-on-accent">
                  VC
                </span>
              </>
            }
          >
            <TopBarLink href="#inicio" label="Inicio" active />
            <TopBarLink href="#movimientos" label="Movimientos" />
          </TopBar>
        </div>
      </Fila>
    </div>
  ),
};
