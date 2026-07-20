import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";

/* `Meta<typeof SearchInput>` anotado a mano y no `satisfies`: con render
 * personalizados, TypeScript no siempre puede nombrar el tipo inferido sin
 * citar rutas internas de Storybook (TS2742). */
const meta: Meta<typeof SearchInput> = {
  title: "Componentes/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Seccion 24 · Search — EXTENSION.** La bajada de la seccion lo dice literal: *extension construida con los tokens del archivo*. No hay ningun nodo de buscador en el archivo de Figma ni variables `--search-*` en `fig-tokens.css`, asi que esto es **propuesta coherente**, no especificacion aprobada.",
          "",
          "Filtra **en vivo**: no hay boton de buscar. La lupa esta siempre a la izquierda y la X de limpiar aparece solo cuando hay texto; en carga la lupa se reemplaza por un aro girando.",
          "",
          "Geometria (bloque `ESTADOS` del prototipo): **52** de alto · radio **12** · borde **0.5px** · texto Sans **16** · lupa **20** a la izquierda 16 · circulo de limpiar **26** a 12 del borde derecho.",
          "",
          "Se sale a proposito de la escala de alturas de control 48/40/32 de la seccion 03: el prototipo lo dibuja a 52 en los cuatro estados.",
          "",
          "El bloque *EN VIVO · FILTRA AL ESCRIBIR* del documento pinta el borde siempre en tinta porque su demo esta permanentemente enfocada. El borde en tinta es el estado **focus**, no el estado por defecto — manda el bloque `ESTADOS`.",
          "",
          "**No renderiza la lista de resultados**: el desplegable de recientes, resultados y *sin resultados* se compone fuera, porque su contenido y su navegacion dependen del dominio de cada pantalla. La story *En vivo* muestra como.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    loading: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    showLabel: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
  },
  args: { placeholder: "Buscar contacto o movimiento" },
  decorators: [
    (Story) => (
      <div className="w-[420px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Estado de reposo: borde `--tk-border-2`, lupa en `--tk-600`, sin X. */
export const Default: Story = {};

/** Con texto aparece la X. Pulsala: vacia el campo y devuelve el foco al input. */
export const ConTexto: Story = {
  name: "Con texto (clear)",
  args: { defaultValue: "Valentina" },
};

/** La lupa se reemplaza por el aro; el campo sigue siendo editable. */
export const Cargando: Story = {
  args: { loading: true, defaultValue: "Valentina" },
  parameters: {
    docs: {
      description: {
        story:
          'El estado se anuncia por una region viva oculta (`role="status"`) y por `aria-busy` en el input. La carga **no bloquea**: el usuario puede seguir afinando la consulta.',
      },
    },
  },
};

/** El documento no dibuja este estado: es la parte mas *extension* del componente. */
export const Deshabilitado: Story = {
  args: { disabled: true, defaultValue: "Valentina" },
};

/** La etiqueta va oculta por defecto; `showLabel` la saca encima del campo. */
export const ConEtiquetaVisible: Story = {
  name: "Con etiqueta visible",
  args: { showLabel: true, label: "Buscar movimientos" },
};

/* --------------------------------------------------------------------------
 * Demo en vivo. El desplegable NO es parte del componente: se compone aqui,
 * igual que lo haria una pantalla de producto.
 * ------------------------------------------------------------------------ */

type Contacto = { ini: string; n: string; t: string };

const CONTACTOS: Contacto[] = [
  { ini: "VM", n: "Valentina Muñoz", t: "@valen" },
  { ini: "CR", n: "Carlos Restrepo", t: "@carlosr" },
  { ini: "AG", n: "Ana Gómez", t: "@anag" },
  { ini: "JT", n: "Julián Torres", t: "12 jul · $120.000" },
  { ini: "MS", n: "María Salazar", t: "@marias" },
];

function normaliza(texto: string) {
  // Sin tildes y en minusculas: buscar "munoz" tiene que encontrar "Muñoz".
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/* La lupa del estado "sin resultados": 22 en --tk-400, tal cual la dibuja el
   bloque EN VIVO del archivo. Se redibuja aqui porque el componente no exporta
   sus glifos — son detalle interno suyo, no API. */
function LupaVacia() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className="text-ink-400"
    >
      <circle cx="8.75" cy="8.75" r="5.75" />
      <path d="m13.1 13.1 3.9 3.9" />
    </svg>
  );
}

/* Cada resultado es un `option` de la lista, no un `button`: en el patron
   combobox el foco NO se mueve nunca de la caja de texto — la fila activa se
   señala con `aria-activedescendant`. Un <button> aqui obligaria a tabular
   fuera del campo para llegar a los resultados. */
function Fila({ c, id, activa }: { c: Contacto; id: string; activa: boolean }) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={activa}
      className={[
        "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left",
        activa ? "bg-surface-2" : "",
      ].join(" ")}
    >
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-pill bg-lavender font-mono text-xs text-on-accent">
        {c.ini}
      </span>
      <span className="flex flex-col gap-px">
        <span className="font-sans text-sm text-ink">{c.n}</span>
        <span className="font-mono text-xs text-ink-600">{c.t}</span>
      </span>
    </div>
  );
}

/**
 * Filtra mientras escribes, sin boton de buscar. Vacio muestra recientes; sin
 * coincidencias, un estado claro con sugerencia.
 *
 * Es tambien la referencia del patron **combobox**: como el componente no
 * renderiza la lista, esta story es el unico sitio donde queda documentado el
 * cableado accesible que el consumidor tiene que poner de su parte.
 */
export const EnVivo: Story = {
  name: "En vivo",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: [
          "El campo delega la lista al consumidor por diseno, asi que **la semantica de autocompletado tambien es suya**. Sin ella un lector de pantalla no anuncia que han aparecido resultados al escribir: la unica region viva del componente solo dice *Buscando*.",
          "",
          'Lo que hay que cablear, y esta story lo hace: `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-activedescendant` en el campo, `role="listbox"` con `role="option"` en la lista, y navegacion con flechas / Enter sin sacar el foco del input.',
        ].join("\n"),
      },
    },
  },
  render: () => {
    function Demo() {
      const [q, setQ] = React.useState("");
      const [activo, setActivo] = React.useState(0);
      const listaId = React.useId();
      const opcionId = (i: number) => `${listaId}-op-${i}`;

      const consulta = normaliza(q.trim());
      const recientes = consulta === "";
      const resultados = recientes
        ? CONTACTOS.slice(0, 3)
        : CONTACTOS.filter(
            (c) => normaliza(c.n).includes(consulta) || normaliza(c.t).includes(consulta),
          );

      /* El indice activo se recorta al filtrar: si la lista encoge, apuntar a
         una fila que ya no existe dejaria un aria-activedescendant colgando. */
      const indice = resultados.length === 0 ? -1 : Math.min(activo, resultados.length - 1);

      const alPulsar = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (resultados.length === 0) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          // preventDefault: las flechas mueven el cursor dentro del input si no.
          event.preventDefault();
          const paso = event.key === "ArrowDown" ? 1 : -1;
          // Se parte del indice ya recortado, no del estado crudo: si la lista
          // encogio al filtrar, sumar sobre el viejo daria un salto raro.
          setActivo((indice + paso + resultados.length) % resultados.length);
          return;
        }
        if (event.key === "Enter") {
          const elegido = resultados[indice];
          if (!elegido) return;
          event.preventDefault();
          setQ(elegido.n);
        }
      };

      return (
        <div className="flex flex-col gap-2">
          <SearchInput
            label="Buscar contacto o movimiento"
            placeholder="Buscar contacto o movimiento"
            value={q}
            onValueChange={(v) => {
              setQ(v);
              // Consulta nueva, lista nueva: se vuelve a la primera fila.
              setActivo(0);
            }}
            onKeyDown={alPulsar}
            /* El desplegable esta siempre visible en esta demo, de ahi el
               aria-expanded fijo. En una pantalla real seguiria al estado que
               decida cuando se abre y cuando se cierra. */
            role="combobox"
            aria-expanded
            aria-controls={listaId}
            aria-autocomplete="list"
            aria-activedescendant={indice >= 0 ? opcionId(indice) : undefined}
          />
          <div
            id={listaId}
            role="listbox"
            aria-label="Resultados"
            className="flex flex-col gap-0.5 rounded-xl border border-edge bg-surface p-1.5 shadow-xs"
          >
            {recientes && (
              <span className="px-3 pt-2 pb-1 font-meta text-[10px] tracking-[0.1em] text-ink-600 uppercase">
                Recientes
              </span>
            )}
            {resultados.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 px-3 py-5 text-center">
                <LupaVacia />
                <span className="font-sans text-[13.5px] text-ink-600">Sin resultados</span>
                <span className="font-mono text-[11px] text-ink-500">
                  prueba con otro nombre o TikinTAG
                </span>
              </div>
            ) : (
              resultados.map((c, i) => (
                <Fila key={c.n} c={c} id={opcionId(i)} activa={i === indice} />
              ))
            )}
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

/**
 * Matriz de especificacion de los cuatro estados del bloque `ESTADOS`.
 *
 * `.tk-static` congela el tema claro: el componente se pinta entero con la capa
 * `--tk-*`, que es justo la que esa clase redefine, asi que la muestra queda
 * completa y no a medias.
 *
 * El estado FOCUS no se puede forzar por prop — depende de `:focus-within` —
 * asi que su muestra se dibuja con las mismas clases que aplica el componente
 * en foco, en vez de fingirla con un `SearchInput` cualquiera.
 */
export const MatrizDeEspecificacion: Story = {
  name: "Matriz de especificación",
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => {
    const rotulo = "font-meta text-[10px] tracking-[0.1em] text-ink-600 uppercase";
    return (
      <div className="tk-static flex w-[460px] max-w-full flex-col gap-5 bg-page p-6">
        <div className="flex flex-col gap-2">
          <span className={rotulo}>Default</span>
          <SearchInput label="Default" placeholder="Buscar" />
        </div>
        <div className="flex flex-col gap-2">
          <span className={rotulo}>Focus</span>
          <SearchInput
            label="Focus"
            placeholder="Buscar"
            defaultValue="Val"
            clearable={false}
            className="border-ink shadow-[inset_0_0_0_0.5px_var(--tk-ink)] [&_svg]:text-ink"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className={rotulo}>Filled + clear</span>
          <SearchInput label="Filled" placeholder="Buscar" defaultValue="Valentina" />
        </div>
        <div className="flex flex-col gap-2">
          <span className={rotulo}>Loading</span>
          <SearchInput label="Loading" placeholder="Buscando…" loading />
        </div>
      </div>
    );
  },
};
