import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

/* Seccion 29 · Tables — EXTENSION construida con la tipografia y la paleta del
 * sistema.
 *
 * Lo dice la propia bajada de la seccion: "Extension con la tipografia y la
 * paleta del sistema". No hay componente Table en el export de Figma
 * (docs/figma-export/components/ no trae ninguno), asi que NADA de este fichero
 * es especificacion aprobada: es una propuesta coherente montada sobre
 * superficies, bordes, radios y familias tipograficas que si son canonicos. Si
 * algun dia Figma publica el componente, este es el fichero que reconciliar.
 *
 * LAS TRES REGLAS DE LA SECCION
 * -----------------------------
 *   SIN ZEBRA ........... filas separadas por 1px gris 240 (--tk-surface-2) y
 *                         hover en hueso. El encabezado va sobre hueso, mono en
 *                         MAYUSCULAS. Nunca bandas alternas.
 *   CIFRAS A LA DERECHA . montos en DM Mono alineados a la derecha; entradas en
 *                         verde, salidas en tinta. Fecha y estado en mono.
 *   ORDEN Y MOVIL ....... columnas ordenables con la flecha ↕. En movil la
 *                         tabla colapsa a tarjetas-fila (eso vive en Cards ·
 *                         list row, no aqui).
 *
 * MEDIDAS, leidas de los style= del prototipo. El archivo dibuja CUATRO juegos
 * de medidas, uno por bloque, y no son consistentes entre si (el eje horizontal
 * salta de 14 a 16 sin criterio). Se destilan en tres densidades:
 *
 *   marco ........... borde 1px --tk-border, radio 16, overflow oculto
 *   default ......... bloque de dispersion. header padding 12/16 y texto 10px;
 *                     fila padding 14/16, sans 14, mono 13, DM Mono 14
 *   medium .......... bloque "CON SELECCION & ACCIONES". header padding 10/14 y
 *                     texto 9px; fila padding 12/14, sans 14, DM Mono 13.
 *                     Es tambien la densidad del bloque "CON TOTAL", que usa
 *                     fila 12/16: se respeta el 12 vertical y se queda en 14
 *                     lateral antes que inventar una cuarta densidad para dos
 *                     pixeles que el propio prototipo no mantiene.
 *   compact ......... bloque "COMPACTA · DENSA". header padding 8/14 y texto
 *                     9px; fila padding 8/14, sans 13, mono 12, DM Mono 13
 *   total ........... borde superior 2px tinta, fondo hueso, padding 14/16,
 *                     label Funnel Display 15/600 y cifra DM Mono 16/500.
 *                     El pie NO se comprime con la densidad (ver TableCell).
 *
 * El header y la fila comparten borde inferior: --tk-border arriba,
 * --tk-surface-2 entre filas; la ultima fila no lleva borde.
 *
 * POR QUE UNA <table> DE VERDAD Y NO LA REJILLA DEL PROTOTIPO
 * -----------------------------------------------------------
 * El prototipo dibuja cada bloque con `display:grid` y <div>. Visualmente da
 * igual, pero un grid de divs pierde toda la semantica de tabla: el lector de
 * pantalla deja de anunciar "columna 3 de 4, MONTO", desaparece la navegacion
 * por celdas y no hay donde colgar aria-sort. Como esta seccion es una
 * extension y no un calco aprobado, aqui manda la accesibilidad: <table> con
 * thead/tbody/tfoot y th[scope]. Las proporciones de columna (2fr 1fr 1fr 1fr)
 * las fija el consumidor con anchos en la cabecera o con un <colgroup>.
 */

type TableDensity = "default" | "medium" | "compact";
type TableSection = "head" | "body" | "foot";

/* La densidad se propaga por contexto en vez de repetirse en cada celda: una
 * tabla densa que se olvide de una columna descuadra la fila entera. */
const DensityContext = React.createContext<TableDensity>("default");

/* La seccion la inyecta cada TableHeader/TableBody/TableFooter. Fila y celda la
 * leen porque su estilo cambia por completo segun donde caigan: el borde del
 * header es --tk-border y el de una fila de cuerpo es --tk-surface-2; el pie
 * ademas invierte la tipografia a display + DM Mono grande. Hacerlo con
 * selectores descendientes desde la raiz (`[&_thead_tr]:...`) tambien
 * funcionaria, pero tailwind-merge no puede resolver esos conflictos contra el
 * className del consumidor y el override quedaria a merced del orden de la
 * hoja. */
const SectionContext = React.createContext<TableSection>("body");

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

export interface TableProps extends React.ComponentPropsWithoutRef<"table"> {
  /**
   * `default` es la tabla de dispersion (filas 14/16, texto 14).
   * `medium` son los bloques con seleccion y con total (filas 12/14, texto 14).
   * `compact` es el bloque "COMPACTA · DENSA" (filas 8/14, texto 13).
   */
  density?: TableDensity;
  /**
   * Dibuja el marco: borde 1px, radio 16 y recorte. Ponlo a false cuando la
   * tabla ya vive dentro de una Card que aporta su propio borde, para no
   * apilar dos lineas de 1px.
   */
  frame?: boolean;
  /**
   * Clases del contenedor que scrollea y dibuja el marco.
   *
   * `className` va al <table> — es donde el consumidor espera que caigan cosas
   * como `table-fixed` — asi que el marco necesita su propia via. Sin ella no
   * habria forma de tocar el radio o el borde sin envolver el componente.
   */
  containerClassName?: string;
  /**
   * Ref al contenedor que scrollea. `ref` apunta al `<table>`, que no es el
   * elemento con overflow: sin esta via no se puede llevar el scroll horizontal
   * a una columna por programacion (`scrollLeft`, `scrollIntoView`) pese a que
   * ese contenedor ya es parte de la API publica via `containerClassName`.
   */
  containerRef?: React.Ref<HTMLDivElement>;
}

/**
 * Tabla de datos densos para web: dispersion, extractos, listados de envio.
 *
 * Sin zebra. La separacion la da una linea de 1px y el ritmo tipografico: mono
 * en mayusculas arriba, sans en el cuerpo, DM Mono a la derecha para las
 * cifras. En movil no se encoje: se cambia por tarjetas-fila.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, containerClassName, containerRef, density = "default", frame = true, ...props },
  ref,
) {
  return (
    /* El scroll horizontal vive en el contenedor, no en la pagina: una tabla de
     * ocho columnas no debe empujar el ancho de todo el documento. Con
     * overflow-x el eje vertical pasa a auto, que es justo lo que recorta las
     * esquinas contra el radio del marco. */
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-full overflow-x-auto",
        frame && "rounded-xl border border-edge",
        containerClassName,
      )}
    >
      <DensityContext.Provider value={density}>
        {/* border-collapse y no border-separate: es el unico modelo en el que
            un borde puesto en el <tr> se pinta. Con separate habria que
            repetirlo celda a celda y cualquier columna olvidada partiria la
            linea. */}
        <table ref={ref} className={cn("w-full border-collapse text-left", className)} {...props} />
      </DensityContext.Provider>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Secciones                                                           */
/* ------------------------------------------------------------------ */

export type TableHeaderProps = React.ComponentPropsWithoutRef<"thead">;

/** Cabecera: fondo hueso y celdas mono en mayusculas. */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <SectionContext.Provider value="head">
        {/* Hueso, no superficie: el encabezado se separa del cuerpo por color
            ademas de por la linea. */}
        <thead ref={ref} className={cn("bg-page", className)} {...props} />
      </SectionContext.Provider>
    );
  },
);

export type TableBodyProps = React.ComponentPropsWithoutRef<"tbody">;

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, ...props }, ref) {
    return (
      <SectionContext.Provider value="body">
        <tbody ref={ref} className={cn(className)} {...props} />
      </SectionContext.Provider>
    );
  },
);

export type TableFooterProps = React.ComponentPropsWithoutRef<"tfoot">;

/**
 * Pie de totales: linea superior de 2px en tinta y fondo hueso.
 *
 * Va en <tfoot> y no como una fila mas del cuerpo para que el lector de
 * pantalla lo anuncie como resumen y no como un dato mas de la lista.
 */
export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <SectionContext.Provider value="foot">
        <tfoot ref={ref} className={cn("bg-page", className)} {...props} />
      </SectionContext.Provider>
    );
  },
);

/* ------------------------------------------------------------------ */
/* Fila                                                                */
/* ------------------------------------------------------------------ */

const tableRow = cva("transition-colors duration-140 ease-[ease]", {
  variants: {
    section: {
      /* Borde de cabecera: --tk-border, mas marcado que el de fila. */
      head: "border-b border-edge",
      /* "Filas separadas por linea 1px gris 240". La ultima no lleva borde: ya
         lo pone el marco. */
      body: "border-b border-surface-2 last:border-b-0",
      /* Linea de total: 2px en tinta, arriba. */
      foot: "border-t-2 border-ink",
    },
    hover: { true: "hover:bg-page", false: "" },
    /* El prototipo pinta la fila seleccionada en hueso, el mismo color que el
       hover. Se conserva tal cual en vez de inventar un tono propio; quien
       necesite distinguirlas puede subir el contraste por className. */
    selected: { true: "bg-page", false: "" },
  },
  defaultVariants: { section: "body", hover: false, selected: false },
});

export interface TableRowProps extends React.ComponentPropsWithoutRef<"tr"> {
  /**
   * Marca la fila como seleccionada: pinta el fondo y publica `aria-selected`
   * y `data-state="selected"`.
   *
   * `aria-selected` es valido en `role="row"`, pero en una tabla estatica su
   * anuncio depende del lector: la seleccion se explota de verdad en grid y
   * treegrid. Por eso el patron correcto sigue siendo poner una casilla real
   * con su propio nombre accesible en la primera celda — el atributo es un
   * refuerzo, no el mecanismo. Para seleccion navegable por celdas hace falta
   * `role="grid"` y su modelo de foco, que este componente no implementa.
   */
  selected?: boolean;
  /**
   * Resalta en hueso al pasar el raton. Activado por defecto en el cuerpo,
   * nunca en cabecera ni en pie. Ponlo a false en tablas de solo lectura donde
   * el resalte sugeriria que la fila se puede pulsar.
   */
  hover?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, selected, hover, ...props },
  ref,
) {
  const section = React.useContext(SectionContext);
  const hoverable = hover ?? section === "body";

  return (
    <tr
      ref={ref}
      className={cn(
        tableRow({ section, hover: hoverable, selected: Boolean(selected), className }),
      )}
      /* Solo cuando hay seleccion en juego: un aria-selected="false" en todas
         las filas de una tabla que no se selecciona es ruido para el lector. */
      aria-selected={selected === undefined ? undefined : selected}
      data-state={selected ? "selected" : undefined}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ */
/* Celdas                                                              */
/* ------------------------------------------------------------------ */

type CellAlign = "left" | "center" | "right";
type CellFont = "sans" | "mono" | "num";
type CellTone = "default" | "muted" | "success" | "error";

const alignClass: Record<CellAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const tableCell = cva("align-middle", {
  variants: {
    density: {
      /* padding 14/16 */
      default: "px-4 py-3.5",
      /* padding 12/14 */
      medium: "px-3.5 py-3",
      /* padding 8/14 */
      compact: "px-3.5 py-2",
    },
    font: {
      sans: "font-sans text-ink",
      /* Fecha y estado en mono. El 600 va aqui, en la base, para que un `tone`
         explicito lo pise por orden de variante. */
      mono: "font-mono text-ink-600",
      /* "Los montos en DM Mono" y cifras de ancho fijo para que las columnas de
         importes alineen digito con digito.

         El PESO sigue al archivo, que NO lo unifica: la dispersion (default) y la
         cifra del Total van en 500; los importes de COMPACTA, CON SELECCION y las
         filas del bloque CON TOTAL van en 400. Por eso el font-medium no vive en
         la base sino en el compound de `default` (y en el pie, via cellClasses);
         `medium` y `compact` se quedan en el 400 nativo de DM Mono. Un peso fijo
         en la base pintaba COMPACTA y CON SELECCION en 500 cuando el archivo los
         da en 400. Quien quiera otro peso lo pisa por className. */
      num: "font-num text-ink tabular-nums",
    },
    /* "entradas en verde, salidas en tinta". El signo lo escribe el consumidor;
       el componente solo tiñe. */
    tone: {
      default: "",
      muted: "text-ink-600",
      success: "text-fg-success",
      error: "text-fg-error",
    },
    align: alignClass,
  },
  compoundVariants: [
    /* El tamaño depende de la familia Y de la densidad, no de una sola:
       sans 14/14/13 · mono 13/13/12 · num 14/13/13. El 500 del importe solo lo
       lleva `default` (la dispersion del archivo); medium y compact quedan en 400. */
    { density: "default", font: "sans", class: "text-sm" },
    { density: "default", font: "mono", class: "text-[13px]" },
    { density: "default", font: "num", class: "text-sm font-medium" },
    /* medium mantiene el sans en 14 y baja solo la cifra a 13: es lo que hace
       el bloque CON SELECCION, donde el nombre pesa mas que el importe. */
    { density: "medium", font: "sans", class: "text-sm" },
    { density: "medium", font: "mono", class: "text-[13px]" },
    { density: "medium", font: "num", class: "text-[13px]" },
    { density: "compact", font: "sans", class: "text-[13px]" },
    { density: "compact", font: "mono", class: "text-xs" },
    { density: "compact", font: "num", class: "text-[13px]" },
  ],
  defaultVariants: { density: "default", font: "sans", tone: "default", align: "left" },
});

/* Clases de una celda de datos, ya resuelto lo que depende del contexto.
 *
 * Vive fuera del cva porque la seccion es contexto y no variante, y porque el
 * pie debe ganar al tamaño y al padding que fija la densidad. Lo usan tanto
 * TableCell como el TableHead que hace de cabecera de fila (scope="row"), para
 * que una fila no mezcle dos tipografias por el hecho de empezar en un <th>. */
function cellClasses(opts: {
  density: TableDensity;
  section: TableSection;
  font: CellFont;
  tone: CellTone;
  align: CellAlign;
}) {
  const { density, section, font, tone, align } = opts;

  return cn(
    tableCell({ density, font, tone, align }),
    /* El pie NO se comprime con la densidad: un total es un resumen, no una
       fila de datos, y el archivo lo pinta siempre en 14/16 con Funnel Display
       15/600 y DM Mono 16/500. Si escalara con la densidad, una tabla compacta
       tendria un pie a medio camino que nadie ha especificado. */
    section === "foot" && "px-4 py-3.5",
    section === "foot" && font === "sans" && "font-display text-[15px] font-semibold",
    // La cifra del Total va SIEMPRE en 500/16 (el archivo la pinta asi), pese a
    // que la base de `num` ya no lleva peso: el pie lo reimpone aqui para que no
    // dependa de la densidad de la tabla.
    section === "foot" && font === "num" && "text-base font-medium",
  );
}

export interface TableCellProps extends React.ComponentPropsWithoutRef<"td"> {
  /**
   * Familia tipografica de la celda.
   * `sans` texto corriente · `mono` fecha y estado · `num` importes en DM Mono.
   */
  font?: CellFont;
  /** Color del contenido. `success` para entradas, tinta para salidas. */
  tone?: CellTone;
  /** Alineacion. `num` se alinea a la derecha salvo que digas otra cosa. */
  align?: CellAlign;
}

/**
 * Celda de datos.
 *
 * Las cifras van SIEMPRE en `font="num"`: DM Mono, peso 500 y alineadas a la
 * derecha. Es lo que permite comparar dos importes de un vistazo sin leerlos.
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, font = "sans", tone = "default", align, ...props },
  ref,
) {
  const density = React.useContext(DensityContext);
  const section = React.useContext(SectionContext);

  /* Regla "CIFRAS A LA DERECHA": si el consumidor no dice nada, un importe se
   * alinea a la derecha. Sigue pudiendo forzar left o center. */
  const resolvedAlign = align ?? (font === "num" ? "right" : "left");

  return (
    <td
      ref={ref}
      className={cn(cellClasses({ density, section, font, tone, align: resolvedAlign }), className)}
      {...props}
    />
  );
});

const tableHead = cva(
  [
    // Ubuntu Mono, MAYUSCULAS por CSS, +10% de tracking, tinta 600.
    "align-middle font-meta font-normal tracking-[0.1em] whitespace-nowrap text-ink-600 uppercase",
  ],
  {
    variants: {
      density: {
        /* padding 12/16 · texto 10 */
        default: "px-4 py-3 text-[10px]",
        /* padding 10/14 · texto 9 */
        medium: "px-3.5 py-2.5 text-[9px]",
        /* padding 8/14 · texto 9 */
        compact: "px-3.5 py-2 text-[9px]",
      },
      align: alignClass,
    },
    defaultVariants: { density: "default", align: "left" },
  },
);

export type TableSortDirection = "asc" | "desc";

export interface TableHeadProps extends React.ComponentPropsWithoutRef<"th"> {
  align?: CellAlign;
  /**
   * Convierte el rotulo en un boton de orden con la flecha ↕.
   * El estado lo lleva el consumidor: este componente no ordena nada, solo
   * avisa y refleja.
   */
  sortable?: boolean;
  /** Sentido actual. `undefined` = la tabla no esta ordenada por esta columna. */
  sortDirection?: TableSortDirection;
  /** Se dispara al pulsar el rotulo, con raton o con Enter/Espacio. */
  onSort?: () => void;
}

/**
 * Celda de cabecera.
 *
 * Dentro de `TableHeader` es una cabecera de columna: `scope="col"`, Ubuntu
 * Mono en MAYUSCULAS. Dentro del cuerpo o del pie es la cabecera de la fila:
 * basta con no pasar `scope` (se resuelve a `"row"`) o pasarlo explicitamente,
 * y entonces se pinta como la celda que es —Ubuntu Sans 14 en tinta— porque el
 * nombre de una fila es un dato, no un rotulo de columna. Es lo que permite al
 * lector de pantalla decir "Maria Rojas, MONTO, 120.000" sin que la primera
 * columna salga en mono de 10px.
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, align, sortable = false, sortDirection, onSort, children, scope, ...props },
  ref,
) {
  const density = React.useContext(DensityContext);
  const section = React.useContext(SectionContext);

  /* Un th fuera del thead nombra su fila; dentro del thead nombra su columna. */
  const resolvedScope = scope ?? (section === "head" ? "col" : "row");
  const isRowHeader = resolvedScope === "row";

  /* El <button> solo aparece si hay a quien avisar: un boton sin onSort se
   * queda en el recorrido de Tab prometiendo una accion que no existe. Sin
   * handler se pinta el rotulo con su flecha, que sigue comunicando el estado
   * de orden a quien lo ve, y aria-sort a quien no. */
  const interactive = sortable && Boolean(onSort);

  return (
    <th
      ref={ref}
      scope={resolvedScope}
      className={
        isRowHeader
          ? cn(
              // Los th nacen en negrita por defecto del navegador; el archivo
              // pinta el nombre de la fila en regular.
              "font-normal",
              cellClasses({
                density,
                section,
                font: "sans",
                tone: "default",
                align: align ?? "left",
              }),
              className,
            )
          : cn(tableHead({ density, align: align ?? "left" }), className)
      }
      /* aria-sort es lo unico que comunica el orden a quien no ve la flecha, y
         solo tiene sentido en una columna ordenable: "none" en una columna que
         no se puede ordenar es enganoso. */
      aria-sort={
        sortable
          ? sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : "none"
          : undefined
      }
      {...props}
    >
      {interactive ? (
        /* Un <button> de verdad, no un th con onClick: asi el foco, el teclado
         * (Enter y Espacio) y el rol vienen del navegador. El boton hereda la
         * tipografia de la celda; solo añade el gap para la flecha. La
         * alineacion horizontal la da el text-align del <th>, no el flex: el
         * boton se ajusta a su contenido. */
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-xs font-[inherit] tracking-[inherit] uppercase",
            "transition-colors duration-140 ease-[ease] outline-none",
            "hover:text-ink",
            "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
          )}
        >
          {children}
          <SortGlyph direction={sortDirection} />
        </button>
      ) : sortable ? (
        <span className="inline-flex items-center gap-1">
          {children}
          <SortGlyph direction={sortDirection} />
        </span>
      ) : (
        children
      )}
    </th>
  );
});

/* Flecha de orden. SVG inline con la geometria de Phosphor (arrows-down-up,
 * arrow-up, arrow-down): Phosphor es la libreria de iconos del sistema pero no
 * es dependencia de @tikin/ui y no puedo añadirla.
 *
 * aria-hidden porque el estado ya lo lleva aria-sort en el <th>; anunciarlo dos
 * veces solo alarga la lectura. */
function SortGlyph({ direction }: { direction?: TableSortDirection }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      // 11px como en el archivo (ph-arrows-down-up a font-size:11px), no 12.
      className="size-[11px] shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      {direction === undefined ? (
        <>
          <path d="M7 4v15M7 19l-3-3M7 19l3-3" />
          <path d="M17 20V5M17 5l-3 3M17 5l3 3" />
        </>
      ) : direction === "asc" ? (
        <path d="M12 20V4M12 4l-5 5M12 4l5 5" />
      ) : (
        <path d="M12 4v16M12 20l-5-5M12 20l5-5" />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Caption                                                             */
/* ------------------------------------------------------------------ */

/* Rotulo de bloque, no cabecera de columna: por eso Ubuntu Sans Mono 13 con
 * tracking .14em (`font-mono`) y no la Ubuntu Mono 10 de las columnas
 * (`font-meta`). Son los dos rotulos que dibuja el archivo y cada uno tiene su
 * familia; el caption hace de "COMPACTA · DENSA", no de "CONTACTO".
 *
 * El padding sigue a la densidad para que el rotulo alinee a la izquierda con
 * la primera columna en vez de flotar sobre ella. */
const tableCaption = cva(
  "caption-top text-left font-mono tracking-[0.14em] text-ink-600 uppercase",
  {
    variants: {
      density: {
        default: "px-4 py-3 text-[13px]",
        medium: "px-3.5 py-2.5 text-[13px]",
        compact: "px-3.5 py-2 text-xs",
      },
    },
    defaultVariants: { density: "default" },
  },
);

export interface TableCaptionProps extends React.ComponentPropsWithoutRef<"caption"> {
  /**
   * Deja el titulo solo para lectores de pantalla. Es lo habitual: la tabla ya
   * suele llevar un encabezado visible encima, pero la <table> necesita un
   * nombre accesible propio.
   */
  visuallyHidden?: boolean;
}

/**
 * Nombre accesible de la tabla. Se renderiza arriba, no abajo.
 *
 * Un caption VISIBLE cae dentro del marco (`frame`), porque el `<caption>` es
 * parte de la `<table>` y el borde lo dibuja el contenedor que scrollea. En el
 * archivo los rotulos de bloque van fuera del marco: para reproducir eso, pon
 * el rotulo como un elemento tuyo encima de la tabla y deja el caption en
 * `visuallyHidden` — la tabla conserva su nombre accesible y el rotulo queda
 * donde el archivo lo pinta.
 */
export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ className, visuallyHidden = false, ...props }, ref) {
    const density = React.useContext(DensityContext);

    return (
      <caption
        ref={ref}
        className={cn(
          tableCaption({ density }),
          // sr-only y no display:none: lo oculto por display no lo lee nadie.
          visuallyHidden && "sr-only",
          className,
        )}
        {...props}
      />
    );
  },
);
