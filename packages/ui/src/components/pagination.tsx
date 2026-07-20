import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 28 · Pagination — EXTENSION.
 *
 * La entradilla del documento lo dice con todas las letras: "Extension con
 * tokens del sistema". No hay ningun nodo de paginacion en el archivo de Figma
 * (docs/figma-export/components/ no exporta nada parecido y fig-tokens.css no
 * declara ningun token --pagination-*). Todo lo de aqui es propuesta coherente
 * con los tokens, NO especificacion aprobada: no lo cites como canonico.
 *
 * GEOMETRIA (fuente: el HTML del prototipo, que aplica los estilos inline)
 *
 *   celda        min-w 36 · h 36 · px 8 · r10 · mono 14
 *                default   fondo transparente · texto --tk-ink
 *                hover     fondo --tk-surface-2
 *                activa    fondo --tk-ink · texto --tk-surface
 *                disabled  texto --tk-400 · cursor not-allowed
 *   flecha       36x36 · r10 · borde 1px --tk-border · glifo 15
 *                tope      texto --tk-400 · cursor not-allowed
 *   lista        gap 6
 *   labels       h36 · px 14 · r10 · borde 1px --tk-border · mono 13 · ls .02em · glifo 14
 *   compacto     h36 · pl 14 pr 6 · r10 · borde 1px · gap 12 · flechas 28x28 r7 gap 2 · glifo 13
 *   saltar       "Ir a" mono 13 --tk-700 · caja 48x36 r10 anillo inset 1px --tk-border-2 · 14
 *   barra        borde 1px --tk-border · r14 · p 12/16 · gap 16
 *                select h34 · px 12 · r9 · anillo inset 1px --tk-border-2 · caret 13 --tk-600
 *                rango mono 13 --tk-600 · flechas 36 con borde, gap 4
 *   cargar mas   boton w100% · h44 · r12 · borde 1px --tk-ink · mono 14 · ls .02em · gap 8
 *                pulsado fondo --tk-border
 *                spinner 16 borde 2px --tk-border-2 con tapa --tk-ink · giro .7s lineal
 *                contador mono 12 --tk-600 · barra h4 r999 sobre --tk-surface-2, relleno tinta
 *                                            transicion de ancho .4s con curva `ease`
 *   sentinel     spinner 18 borde 2px --tk-border con tapa --tk-ink · giro .7s lineal
 *                texto mono 12 --tk-600
 *
 * TRES DECISIONES QUE SE APARTAN DE LO DIBUJADO, Y POR QUE
 * -------------------------------------------------------
 * 1. LOS EXTREMOS NO USAN EL ATRIBUTO `disabled`, sino aria-disabled. El
 *    documento solo pide que prev/next "nunca desaparecen, solo bajan a gris
 *    400", y visualmente queda igual. Pero un boton con `disabled` deja de ser
 *    enfocable: al llegar a la ultima pagina pulsando "siguiente", el foco del
 *    teclado se caeria al body justo en el clic que cierra el recorrido. Con
 *    aria-disabled el boton conserva el foco y el lector anuncia el estado.
 *    Mismo criterio que el `loading` de Button.
 *
 * 2. RADIOS 7, 9 Y 14. La escala del sistema es 6/8/10/12/16/20, pero el
 *    prototipo dibuja las flechas compactas a r7, el select de la barra a r9 y
 *    la barra a r14. Al no haber nodo de Figma, el prototipo ES la fuente de
 *    pixeles, asi que se respetan literalmente con sintaxis arbitraria en vez
 *    de redondearlos a la escala. Si esta seccion llega algun dia al archivo,
 *    este es el sitio donde reconciliarlos.
 *
 * 3. EL LABEL DE "CARGAR MAS" VA EN MAYUSCULAS. En el HTML ese texto es una
 *    interpolacion ({{ loadMoreLabel }}), asi que su capitalizacion no se puede
 *    leer del prototipo. Se pone en mayusculas porque sus hermanos del mismo
 *    bloque — ANTERIOR / SIGUIENTE — si estan escritos asi, comparten la misma
 *    tipografia mono con +2% de tracking, y es la regla de todos los botones
 *    del sistema. Como manda la regla general, en MAYUSCULAS POR CSS: nunca con
 *    toUpperCase(), que romperia el texto accesible y lo copiado al portapapeles.
 *
 * COLOR EN TEMA OSCURO
 * --------------------
 * Todo sale de utilidades semanticas (ink, surface, surface-2, ink-400/600/700,
 * edge, edge-2), que ya invierten con .dark. No hay ni un color fijo.
 */

/* Geometria de Phosphor — la libreria de iconos oficial del sistema — copiada a
 * mano (viewBox 256, trazo 16 = peso regular) porque el paquete de iconos no es
 * dependencia de packages/ui y este encargo no puede tocar su package.json. */
const CaretLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
    <path
      d="M160 208 80 128l80-80"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaretRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
    <path
      d="m96 48 80 80-80 80"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaretDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" fill="none" aria-hidden="true" {...props}>
    <path
      d="M208 96l-80 80-80-80"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Anillo de foco comun a todo lo pulsable de la seccion. */
const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page";

/* ------------------------------------------------------------------------ */
/* Rango de paginas                                                          */
/* ------------------------------------------------------------------------ */

export type PaginationRangeEntry = number | "ellipsis";

/**
 * Calcula que paginas se pintan: primera, ultima, la actual y sus vecinas;
 * el resto colapsa en `"ellipsis"` para que la barra no crezca sin limite.
 *
 * Se exporta a proposito. Es logica pura y sin DOM, asi que el consumidor que
 * necesite otro envoltorio (una tabla virtualizada, un pager de servidor) puede
 * reutilizar exactamente el mismo reparto sin copiar el componente.
 *
 * @param page          pagina actual, base 1
 * @param totalPages    numero total de paginas
 * @param siblingCount  vecinas a cada lado de la actual
 */
export function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount = 1,
): PaginationRangeEntry[] {
  const total = Math.max(Math.trunc(totalPages), 0);
  if (total === 0) return [];

  const siblings = Math.max(Math.trunc(siblingCount), 0);
  const current = Math.min(Math.max(Math.trunc(page), 1), total);

  /* Primera + ultima + actual + vecinas a los dos lados + dos huecos. Por
     debajo de este umbral colapsar no ahorraria ni una celda, y ademas
     sustituir un numero por "…" seria una perdida neta de informacion. */
  const slots = siblings * 2 + 5;
  if (total <= slots) return numbers(1, total);

  let left = Math.max(current - siblings, 1);
  let right = Math.min(current + siblings, total);

  /* Un hueco que oculta UNA sola pagina no ahorra ninguna celda — "…" ocupa lo
     mismo que el numero que tapa — asi que se pinta el numero. El ancho total
     no cambia y el usuario gana un salto directo. */
  if (left === 3) left = 2;
  if (right === total - 2) right = total - 1;

  const gapLeft = left > 2;
  const gapRight = right < total - 1;

  if (!gapLeft && !gapRight) return numbers(1, total);
  if (!gapLeft) return [...numbers(1, Math.max(slots - 2, right)), "ellipsis", total];
  if (!gapRight) return [1, "ellipsis", ...numbers(Math.min(total - slots + 3, left), total)];
  return [1, "ellipsis", ...numbers(left, right), "ellipsis", total];
}

function numbers(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

/* ------------------------------------------------------------------------ */
/* Celda de pagina                                                           */
/* ------------------------------------------------------------------------ */

const paginationItem = cva(
  [
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2",
    // Las cifras van SIEMPRE mono, como el resto de numeros del sistema.
    "font-mono text-sm leading-none",
    "cursor-pointer transition-colors duration-140 ease-out select-none",
    FOCUS_RING,
    // El tope no usa :disabled sino aria-disabled — ver decision 1 de arriba.
    "aria-disabled:cursor-not-allowed aria-disabled:text-ink-400",
  ],
  {
    variants: {
      active: {
        true: "bg-ink text-surface",
        false: "bg-transparent text-ink hover:not-aria-disabled:bg-surface-2",
      },
    },
    defaultVariants: { active: false },
  },
);

export interface PaginationItemProps
  extends
    Omit<React.ComponentPropsWithoutRef<"button">, "type">,
    Omit<VariantProps<typeof paginationItem>, "active"> {
  /** La pagina que se esta viendo. Marca `aria-current="page"`. */
  active?: boolean;
  /**
   * Tope alcanzado. NO emite el atributo `disabled`: baja a gris 400, conserva
   * el foco y corta el clic. Ver decision 1 de la cabecera.
   */
  disabled?: boolean;
}

/**
 * Celda numerica suelta. `Pagination` la usa por dentro; se exporta para quien
 * necesite montar un pager a medida sin repetir los tokens.
 */
export const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
  function PaginationItem({ className, active = false, disabled, onClick, ...props }, ref) {
    return (
      <button
        ref={ref}
        // Sin type explicito un <button> dentro de un <form> lo envia.
        type="button"
        className={cn(paginationItem({ active }), className)}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          // Al no poner el atributo `disabled` (para no perder el foco) hay que
          // cortar el clic a mano.
          if (disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...props}
      />
    );
  },
);

/* ------------------------------------------------------------------------ */
/* Flecha                                                                    */
/* ------------------------------------------------------------------------ */

const paginationArrow = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
    "cursor-pointer text-ink transition-colors duration-140 ease-out select-none",
    FOCUS_RING,
    "hover:not-aria-disabled:bg-surface-2",
    "aria-disabled:cursor-not-allowed aria-disabled:text-ink-400",
  ],
  {
    variants: {
      size: {
        m: "size-9 rounded-md [--tk-pg-caret:15px]",
        // r7 no esta en la escala 6/8/10/12: es lo que dibuja el prototipo.
        s: "size-7 rounded-[7px] [--tk-pg-caret:13px]",
      },
      bordered: { true: "border border-edge", false: "" },
    },
    defaultVariants: { size: "m", bordered: true },
  },
);

export interface PaginationArrowProps
  extends
    Omit<React.ComponentPropsWithoutRef<"button">, "type">,
    VariantProps<typeof paginationArrow> {
  /** Hacia donde apunta. Solo cambia el glifo; el salto lo decide el consumidor. */
  direction: "prev" | "next";
}

/**
 * Flecha de anterior / siguiente.
 *
 * En los extremos NO se desmonta ni se apaga con el atributo `disabled`: baja a
 * gris 400 y sigue siendo enfocable. Ver decision 1 de la cabecera.
 */
export const PaginationArrow = React.forwardRef<HTMLButtonElement, PaginationArrowProps>(
  function PaginationArrow(
    { className, direction, size, bordered, disabled, onClick, ...props },
    ref,
  ) {
    const Caret = direction === "prev" ? CaretLeftIcon : CaretRightIcon;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(paginationArrow({ size, bordered }), className)}
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...props}
      >
        <Caret className="size-[var(--tk-pg-caret)]" />
      </button>
    );
  },
);

/* ------------------------------------------------------------------------ */
/* Pagination                                                                */
/* ------------------------------------------------------------------------ */

export interface PaginationLabels {
  /** Nombre accesible del `<nav>`. Un `aria-label` propio lo sobreescribe. */
  root: string;
  /** Texto accesible de la flecha anterior. */
  previous: string;
  /** Texto accesible de la flecha siguiente. */
  next: string;
  /** Texto VISIBLE del formato `labels`. Se pone en mayusculas por CSS. */
  previousShort: string;
  /** Texto VISIBLE del formato `labels`. */
  nextShort: string;
  /** Texto accesible de cada celda numerica. */
  page: (page: number) => string;
  /** Texto del formato `compact`, tambien usado como resumen para lectores. */
  status: (page: number, totalPages: number) => string;
}

const DEFAULT_LABELS: PaginationLabels = {
  root: "Paginación",
  previous: "Página anterior",
  next: "Página siguiente",
  previousShort: "Anterior",
  nextShort: "Siguiente",
  page: (page) => `Página ${page}`,
  status: (page, totalPages) => `Página ${page} de ${totalPages}`,
};

export interface PaginationProps extends Omit<React.ComponentPropsWithoutRef<"nav">, "onChange"> {
  /** Pagina actual, base 1. Componente controlado: el estado vive fuera. */
  page: number;
  /** Total de paginas. Con 0 o 1 el pager sigue visible pero sin saltos posibles. */
  totalPages: number;
  /** Se llama con la pagina destino, ya saturada al rango valido. */
  onPageChange?: (page: number) => void;
  /**
   * `numbers` para tablas y extractos web · `labels` cuando solo caben dos
   * botones con texto · `compact` cuando el ancho es el que manda.
   */
  format?: "numbers" | "labels" | "compact";
  /** Vecinas a cada lado de la actual antes de colapsar con "…". */
  siblingCount?: number;
  /** Textos accesibles y visibles. Se fusiona con los del sistema. */
  labels?: Partial<PaginationLabels>;
}

/**
 * Paginacion numerica del sistema Tikin.
 *
 * Es para vistas WEB densas — tablas, extractos. En la app movil no se usa:
 * ahi van `LoadMore` o `LoadMoreSentinel` con su contador.
 *
 * Se apoya en `<nav>` + `<ul>` + `<button>` nativos, asi que el teclado
 * funciona solo: Tab recorre las celdas en orden visual y Enter o Espacio
 * saltan. La pagina en curso lleva `aria-current="page"`.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    className,
    page,
    totalPages,
    onPageChange,
    format = "numbers",
    siblingCount = 1,
    labels,
    ...props
  },
  ref,
) {
  const text = { ...DEFAULT_LABELS, ...labels };

  const total = Math.max(Math.trunc(totalPages), 0);
  /* Un `page` fuera de rango dejaria la lista sin ninguna celda activa. Se
     satura una sola vez aqui y todo lo de abajo trabaja con un valor valido. */
  const current = total === 0 ? 0 : Math.min(Math.max(Math.trunc(page), 1), total);

  const atStart = current <= 1;
  const atEnd = total === 0 || current >= total;

  const go = (target: number) => {
    const clamped = Math.min(Math.max(target, 1), Math.max(total, 1));
    // Repetir la pagina en la que ya estas no es un cambio: no se notifica, o
    // el consumidor recargaria la tabla al pulsar la celda activa.
    if (clamped === current) return;
    onPageChange?.(clamped);
  };

  const prev = (
    <PaginationArrow
      direction="prev"
      size={format === "compact" ? "s" : "m"}
      bordered={format !== "compact"}
      disabled={atStart}
      aria-label={text.previous}
      onClick={() => go(current - 1)}
    />
  );

  const next = (
    <PaginationArrow
      direction="next"
      size={format === "compact" ? "s" : "m"}
      bordered={format !== "compact"}
      disabled={atEnd}
      aria-label={text.next}
      onClick={() => go(current + 1)}
    />
  );

  return (
    <nav
      ref={ref}
      className={cn(format === "numbers" && "flex", className)}
      // Va antes del spread para que un aria-label del consumidor gane.
      aria-label={text.root}
      {...props}
    >
      {format === "numbers" && (
        /* role="list" redundante A PROPOSITO: el reset de Tailwind quita la
           viñeta y WebKit le retira entonces la semantica de lista, asi que sin
           el atributo VoiceOver no diria "lista de N elementos" y el usuario
           perderia de cuantas paginas se habla. Misma razon que en file-upload
           y en steps. */
        <ul role="list" className="flex flex-wrap items-center gap-1.5">
          <li>{prev}</li>
          {getPaginationRange(current, total, siblingCount).map((entry, index) =>
            entry === "ellipsis" ? (
              /* El hueco es decorativo: no aporta nada leerlo en voz alta, y el
                 total ya lo dice el resumen sr-only del final. */
              <li
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="flex h-9 min-w-9 items-center justify-center px-2 font-mono text-sm text-ink-500"
              >
                …
              </li>
            ) : (
              <li key={entry}>
                <PaginationItem
                  active={entry === current}
                  aria-label={text.page(entry)}
                  onClick={() => go(entry)}
                >
                  {entry}
                </PaginationItem>
              </li>
            ),
          )}
          <li>{next}</li>
        </ul>
      )}

      {format === "labels" && (
        <div className="flex items-center gap-2">
          <LabelButton
            direction="prev"
            disabled={atStart}
            aria-label={text.previous}
            onClick={() => go(current - 1)}
          >
            {text.previousShort}
          </LabelButton>
          <LabelButton
            direction="next"
            disabled={atEnd}
            aria-label={text.next}
            onClick={() => go(current + 1)}
          >
            {text.nextShort}
          </LabelButton>
        </div>
      )}

      {format === "compact" && (
        <div className="inline-flex h-9 items-center gap-3 rounded-md border border-edge pr-1.5 pl-3.5">
          <span className="font-mono text-[13px] text-ink">{text.status(current, total)}</span>
          <div className="flex gap-0.5">
            {prev}
            {next}
          </div>
        </div>
      )}

      {/* Los formatos numeric y labels no dicen en ningun sitio donde estas: la
          celda activa se distingue por color, y el color no llega al lector de
          pantalla. Este resumen lo pone en palabras una sola vez. */}
      {format !== "compact" && <span className="sr-only">{text.status(current, total)}</span>}
    </nav>
  );
});

interface LabelButtonProps extends Omit<React.ComponentPropsWithoutRef<"button">, "type"> {
  direction: "prev" | "next";
}

/* Prev/next con texto. No reutiliza Button porque su escala de alturas (48/40/
   32/28) no tiene el 36 que pide esta seccion, y forzarlo desde fuera con
   className seria mas fragil que estas seis clases. */
function LabelButton({
  className,
  direction,
  disabled,
  onClick,
  children,
  ...props
}: LabelButtonProps) {
  const Caret = direction === "prev" ? CaretLeftIcon : CaretRightIcon;
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md border border-edge px-3.5",
        // Mayusculas POR CSS: en JS romperia el texto accesible y el copiado.
        "font-mono text-[13px] tracking-[0.02em] text-ink uppercase",
        "cursor-pointer transition-colors duration-140 ease-out select-none",
        FOCUS_RING,
        "hover:not-aria-disabled:bg-surface-2",
        "aria-disabled:cursor-not-allowed aria-disabled:text-ink-400",
        className,
      )}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      {direction === "prev" && <Caret className="size-[14px] shrink-0" />}
      {children}
      {direction === "next" && <Caret className="size-[14px] shrink-0" />}
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* Saltar a pagina                                                           */
/* ------------------------------------------------------------------------ */

export interface PaginationJumpProps
  // `prefix` se omite del <div>: ahi es el atributo RDFa (una cadena) y aqui
  // hace falta como nodo para poder rotular la caja con un icono si conviene.
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange" | "prefix"> {
  /** Pagina actual, base 1. */
  page: number;
  /** Total de paginas. */
  totalPages: number;
  /** Se llama al confirmar, con la pagina ya saturada al rango valido. */
  onPageChange?: (page: number) => void;
  /** Texto antes de la caja. */
  prefix?: React.ReactNode;
  /** Texto despues de la caja. Recibe el total. */
  suffix?: (totalPages: number) => React.ReactNode;
  /** Nombre accesible de la caja, que visualmente solo muestra un numero. */
  inputLabel?: string;
}

/**
 * "Ir a [ 3 ] de 12" — salto directo para listados muy largos, donde recorrer
 * las paginas de una en una no es viable.
 *
 * Se confirma con Enter o al salir del campo, nunca en cada pulsacion: escribir
 * "12" pasaria primero por "1" y recargaria la tabla en la pagina equivocada.
 */
export const PaginationJump = React.forwardRef<HTMLDivElement, PaginationJumpProps>(
  function PaginationJump(
    {
      className,
      page,
      totalPages,
      onPageChange,
      prefix = "Ir a",
      suffix = (total) => `de ${total}`,
      inputLabel = "Ir a la página",
      ...props
    },
    ref,
  ) {
    const total = Math.max(Math.trunc(totalPages), 0);
    /* Un listado vacio no tiene pagina 1: se dice 0, igual que hacen Pagination
       y PaginationBar, en vez de inventarse una pagina a la que no se puede ir. */
    const current = total === 0 ? 0 : Math.min(Math.max(Math.trunc(page), 1), total);

    const [draft, setDraft] = React.useState(() => String(current));
    /* Sincronizar `draft` con la pagina de fuera se hace ajustando estado
       DURANTE el render, no en un efecto: con useEffect el campo pintaria un
       fotograma con el valor viejo cada vez que la pagina cambia desde otro
       control (las flechas, por ejemplo). */
    const [lastPage, setLastPage] = React.useState(current);
    if (current !== lastPage) {
      setLastPage(current);
      setDraft(String(current));
    }

    const commit = () => {
      const parsed = Number.parseInt(draft, 10);
      if (Number.isNaN(parsed)) {
        // Basura escrita: se vuelve a lo ultimo valido en vez de saltar al 1.
        setDraft(String(current));
        return;
      }
      if (total === 0) {
        // Sin paginas no hay destino: notificar un 1 inexistente haria que el
        // consumidor pidiese datos de una pagina que no existe.
        setDraft(String(current));
        return;
      }
      const clamped = Math.min(Math.max(parsed, 1), total);
      setDraft(String(clamped));
      if (clamped !== current) onPageChange?.(clamped);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 font-mono text-[13px] text-ink-700",
          className,
        )}
        {...props}
      >
        {prefix}
        <input
          value={draft}
          // Teclado numerico en movil sin usar type="number", que en varios
          // navegadores admite "e", "+" y notacion cientifica.
          inputMode="numeric"
          aria-label={inputLabel}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            // Sin esto, un Enter dentro de un <form> lo enviaria antes de que
            // el consumidor haya recibido la pagina nueva.
            event.preventDefault();
            commit();
          }}
          className={cn(
            "h-9 w-12 rounded-md bg-transparent text-center",
            "font-mono text-sm text-ink",
            "shadow-[inset_0_0_0_1px_var(--tk-border-2)]",
            FOCUS_RING,
          )}
        />
        {suffix(total)}
      </div>
    );
  },
);

/* ------------------------------------------------------------------------ */
/* Barra de rango + tamaño de pagina                                         */
/* ------------------------------------------------------------------------ */

export interface PaginationBarProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "onChange"
> {
  /** Pagina actual, base 1. */
  page: number;
  /** Filas por pagina. */
  pageSize: number;
  /** Total de filas del listado, no de paginas. */
  total: number;
  /** Se llama con la pagina destino. */
  onPageChange?: (page: number) => void;
  /** Se llama con el tamaño nuevo. Sin esta prop el selector no se pinta. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Opciones del selector. */
  pageSizeOptions?: number[];
  /** Etiqueta del selector. Es tambien su nombre accesible. */
  pageSizeLabel?: string;
  /** Texto del rango. Por defecto "41–60 de 128". */
  formatRange?: (from: number, to: number, total: number) => React.ReactNode;
  /**
   * Textos accesibles: `root` nombra el grupo, `previous`/`next` las flechas y
   * `status` el resumen "Página X de Y" que solo oye el lector de pantalla.
   */
  labels?: Partial<Pick<PaginationLabels, "root" | "previous" | "next" | "status">>;
}

/**
 * Pie de tabla: filas por pagina, rango visible y flechas. Es el formato de las
 * vistas web densas — extractos, movimientos, listados de administracion.
 *
 * El selector es un `<select>` nativo a proposito: en movil abre la rueda del
 * sistema y en teclado responde a las flechas y a la escritura por prefijo sin
 * una linea de JavaScript.
 */
export const PaginationBar = React.forwardRef<HTMLDivElement, PaginationBarProps>(
  function PaginationBar(
    {
      className,
      page,
      pageSize,
      total,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = [10, 20, 50, 100],
      pageSizeLabel = "Filas por página",
      formatRange = (from, to, count) => `${from}–${to} de ${count}`,
      labels,
      ...props
    },
    ref,
  ) {
    const text = { ...DEFAULT_LABELS, ...labels };

    const rows = Math.max(Math.trunc(total), 0);
    const size = Math.max(Math.trunc(pageSize), 1);
    const totalPages = Math.max(Math.ceil(rows / size), 1);
    const current = Math.min(Math.max(Math.trunc(page), 1), totalPages);

    // Con la tabla vacia el rango es 0–0: pintar "1–0 de 0" seria absurdo.
    const from = rows === 0 ? 0 : (current - 1) * size + 1;
    const to = Math.min(current * size, rows);

    const go = (target: number) => {
      const clamped = Math.min(Math.max(target, 1), totalPages);
      if (clamped === current) return;
      onPageChange?.(clamped);
    };

    return (
      <div
        ref={ref}
        className={cn(
          // r14 no esta en la escala del sistema: es lo que dibuja el prototipo.
          "flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-edge px-4 py-3",
          className,
        )}
        /* Grupo con nombre, no landmark de navegacion: un pie de tabla convive
           con otros en la misma pantalla y cuatro landmarks homonimos ensucian
           la lista del lector. `role` y `aria-label` van ANTES del spread para
           que el consumidor pueda cambiarlos. */
        role="group"
        aria-label={text.root}
        {...props}
      >
        {onPageSizeChange && (
          // El <label> envolvente da nombre al select sin necesidad de un id.
          <label className="inline-flex items-center gap-2.5 font-mono text-[13px] text-ink-700">
            {pageSizeLabel}
            <span
              className={cn(
                "relative inline-flex h-[34px] items-center gap-2 rounded-[9px] px-3 text-ink",
                "shadow-[inset_0_0_0_1px_var(--tk-border-2)]",
                // El anillo se pinta en el envoltorio porque el foco lo recibe
                // el <select>, que va sin borde propio.
                "focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-2 focus-within:ring-offset-page",
              )}
            >
              <select
                value={size}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                className="cursor-pointer appearance-none bg-transparent font-mono text-[13px] text-ink outline-none"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {/* Decorativo: el select nativo ya se abre solo al pulsarlo. */}
              <CaretDownIcon className="pointer-events-none size-[13px] shrink-0 text-ink-600" />
            </span>
          </label>
        )}

        {/* role=status: al cambiar de pagina el lector anuncia el rango nuevo,
            que es la unica pista de que la tabla se ha movido. */}
        <span role="status" className="font-mono text-[13px] text-ink-600">
          {formatRange(from, to, rows)}
        </span>

        <div className="flex items-center gap-1">
          <PaginationArrow
            direction="prev"
            disabled={current <= 1}
            aria-label={text.previous}
            onClick={() => go(current - 1)}
          />
          <PaginationArrow
            direction="next"
            disabled={current >= totalPages}
            aria-label={text.next}
            onClick={() => go(current + 1)}
          />
        </div>

        {/* El rango dice cuantas filas se ven, no en que pagina estas: sin este
            resumen el lector no tiene forma de saberlo. Va estatico y fuera del
            role=status de arriba para no anunciar dos cosas en cada cambio. Con
            la tabla vacia se calla: no se esta en ninguna pagina. */}
        {rows > 0 && <span className="sr-only">{text.status(current, totalPages)}</span>}
      </div>
    );
  },
);

/* ------------------------------------------------------------------------ */
/* Cargar mas (movil)                                                        */
/* ------------------------------------------------------------------------ */

export interface LoadMoreProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Cuantos elementos hay ya en pantalla. */
  loaded: number;
  /** Cuantos hay en total. */
  total: number;
  /** Se llama al pulsar. Sin ella el boton no hace nada. */
  onLoadMore?: () => void;
  /** Añade un spinner JUNTO al label — no lo sustituye — y bloquea la pulsacion. */
  loading?: boolean;
  /** Texto del boton. Se pone en mayusculas por CSS. */
  label?: React.ReactNode;
  /** Contador bajo el boton. */
  formatCount?: (loaded: number, total: number) => React.ReactNode;
  /** Oculta la barra de progreso, que por defecto acompaña al contador. */
  hideProgress?: boolean;
}

/**
 * "Cargar mas" de la app movil: boton, contador y barra de avance.
 *
 * El contador NO es opcional por diseño — el documento lo pide siempre — porque
 * un boton solo no dice cuanto queda, y el usuario no sabe si le esperan dos
 * pulsaciones o cuarenta.
 *
 * Cuando ya no queda nada por traer, el boton desaparece y se quedan el
 * contador y la barra: dejarlo puesto sin efecto seria una promesa falsa.
 */
export const LoadMore = React.forwardRef<HTMLDivElement, LoadMoreProps>(function LoadMore(
  {
    className,
    loaded,
    total,
    onLoadMore,
    loading = false,
    label = "Cargar más",
    formatCount = (shown, count) => `Mostrando ${shown} de ${count}`,
    hideProgress = false,
    ...props
  },
  ref,
) {
  const count = Math.max(Math.trunc(total), 0);
  const shown = Math.min(Math.max(Math.trunc(loaded), 0), count);
  const hasMore = shown < count;
  const percent = count === 0 ? 0 : Math.round((shown / count) * 100);

  return (
    <div ref={ref} className={cn("flex w-full flex-col items-center gap-3", className)} {...props}>
      {hasMore && (
        <button
          type="button"
          className={cn(
            "relative flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-ink bg-transparent",
            // Mayusculas POR CSS — ver decision 3 de la cabecera.
            "font-mono text-sm tracking-[0.02em] text-ink uppercase",
            "cursor-pointer transition-colors duration-140 ease-out select-none",
            FOCUS_RING,
            // El prototipo declara el pulsado (data-press) ademas del hover, y
            // es el mismo par que usan chip, filter-chip y menu-button.
            "hover:not-aria-busy:bg-surface-2 active:not-aria-busy:bg-edge",
            loading && "cursor-wait",
          )}
          /* Mismo criterio que Button: durante la carga NO se pone `disabled`,
             que sacaria el foco del boton recien pulsado. aria-busy comunica el
             estado y el clic se corta a mano. */
          aria-busy={loading || undefined}
          aria-disabled={loading || undefined}
          onClick={(event) => {
            if (loading) {
              event.preventDefault();
              return;
            }
            onLoadMore?.();
          }}
        >
          {loading && (
            <span
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 rounded-full border-2 border-edge-2 border-t-ink",
                // animate-spin de Tailwind gira a 1s; el prototipo pide 0.7s
                // lineal, como el Spinner del sistema.
                "animate-spin [animation-duration:0.7s]",
                // Un aro congelado se lee como interfaz rota, no como respeto
                // por la preferencia: se ralentiza en vez de pararse.
                "motion-reduce:[animation-duration:2.1s]",
              )}
            />
          )}
          {label}
        </button>
      )}

      {/* role=status: tras cada carga el lector anuncia el contador nuevo, que
          es la unica confirmacion de que han entrado mas elementos. */}
      <span role="status" className="font-mono text-xs text-ink-600">
        {formatCount(shown, count)}
      </span>

      {!hideProgress && (
        // aria-hidden: la barra repite exactamente lo que dice el contador de
        // arriba, y un progressbar duplicado solo añade ruido al lector.
        <div aria-hidden="true" className="h-1 w-full overflow-hidden rounded-pill bg-surface-2">
          <div
            /* `ease` literal del prototipo (transition: width .4s ease), que no
               es el ease-out del resto del sistema: aqui la barra avanza sola y
               una curva simetrica disimula mejor el salto de porcentaje. */
            className="h-full bg-ink transition-[width] duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------------ */
/* Sentinel de scroll infinito (movil)                                       */
/* ------------------------------------------------------------------------ */

export interface LoadMoreSentinelProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Se llama cuando el sentinel entra en pantalla y quedan elementos. */
  onReachEnd: () => void;
  /** Ya se esta cargando: no se vuelve a disparar hasta que termine. */
  loading?: boolean;
  /** Quedan elementos por traer. En falso el observador ni se monta. */
  hasMore?: boolean;
  /** Margen de anticipacion. Por defecto dispara 200px antes de ser visible. */
  rootMargin?: string;
  /** Texto mientras carga. */
  label?: React.ReactNode;
}

/**
 * Sentinel de scroll infinito: un elemento al final de la lista que dispara la
 * carga al asomar. Sin boton.
 *
 * Es la alternativa movil a `LoadMore`. Elige uno de los dos, nunca los dos a
 * la vez: dos disparadores para la misma carga acaban pidiendo la pagina dos
 * veces.
 */
export const LoadMoreSentinel = React.forwardRef<HTMLDivElement, LoadMoreSentinelProps>(
  function LoadMoreSentinel(
    {
      className,
      onReachEnd,
      loading = false,
      hasMore = true,
      rootMargin = "200px",
      label = "Cargando más…",
      ...props
    },
    ref,
  ) {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => nodeRef.current as HTMLDivElement);

    /* El callback vive en una ref para que el observador no se desmonte y se
       vuelva a montar en cada render del padre: reconectarlo perderia la
       interseccion en curso y la carga no llegaria a dispararse. */
    const callbackRef = React.useRef(onReachEnd);
    React.useEffect(() => {
      callbackRef.current = onReachEnd;
    });

    React.useEffect(() => {
      const node = nodeRef.current;
      // Sin IntersectionObserver (jsdom, navegadores viejos) el componente se
      // queda inerte en vez de romper: el consumidor puede dar salida con un
      // boton `LoadMore` de reserva.
      if (!node || !hasMore || loading || typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) callbackRef.current();
        },
        { rootMargin },
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, [hasMore, loading, rootMargin]);

    return (
      <div
        ref={nodeRef}
        // min-h 1px: un elemento de altura cero nunca llega a intersecar en
        // algunos navegadores y el sentinel no dispararia jamas.
        className={cn("flex min-h-px w-full items-center justify-center", className)}
        {...props}
      >
        {loading && (
          <div
            role="status"
            className="flex items-center justify-center gap-2.5 p-3.5 font-mono text-xs text-ink-600"
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-[18px] shrink-0 rounded-full border-2 border-edge border-t-ink",
                // 0.7s lineal como el resto de aros del sistema; animate-spin a
                // secas giraria a 1s.
                "animate-spin [animation-duration:0.7s]",
                "motion-reduce:[animation-duration:2.1s]",
              )}
            />
            {label}
          </div>
        )}
      </div>
    );
  },
);
