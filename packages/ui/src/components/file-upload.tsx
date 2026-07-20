import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Progress } from "./progress";

/* Seccion 31 · File upload — EXTENSION.
 *
 * El propio documento lo dice en la entradilla: "Extension con la paleta y los
 * radios del sistema". No hay ningun nodo de subida en el archivo de Figma
 * (docs/figma-export/components/ no exporta nada parecido y fig-tokens.css no
 * declara ningun token --upload-*, --dropzone-* ni --file-*). Asi que TODO lo
 * que hay aqui es propuesta coherente con los tokens, no especificacion
 * aprobada. No lo cites como canonico.
 *
 * QUE ENTRA Y QUE NO
 * ------------------
 * El documento dibuja siete bloques. Aqui estan los cinco que son de verdad
 * "subir un archivo":
 *
 *   FileUpload           dropzone (EN VIVO · DROPZONE) y campo compacto
 *                        (CAMPO COMPACTO · INLINE)
 *   FileUploadList       la lista que agrupa las filas
 *   FileUploadItem       FILA DE ARCHIVO · ESTADOS, los seis estados
 *   FileUploadThumbnail  MINIATURA · IMAGEN, incluido el tile de "+"
 *   FileTypeIcon         TIPOS DE ARCHIVO, icono por formato
 *
 * Quedan deliberadamente fuera dos bloques que el documento pinta en esta
 * seccion pero que no son este componente:
 *   · FOTO DE PERFIL — es el selector de avatar, y el avatar tiene su propio
 *     componente en el sistema. Duplicar aqui su recorte circular crearia dos
 *     fuentes de verdad para la misma pieza.
 *   · MULTI-ARCHIVO · PROGRESO GLOBAL — es composicion pura de una barra de
 *     progreso y dos botones, ambos ya componentes del sistema.
 *
 * Los dos se muestran como stories de composicion (`Progreso global` y `Foto de
 * perfil` en file-upload.stories.tsx), no como API nueva: asi la seccion queda
 * documentada entera sin duplicar componentes que ya existen.
 *
 * La barra de la fila TAMPOCO se dibuja aqui: la pinta `Progress`, que ya va
 * sobre Radix Progress. De ahi salen aria-valuetext ("62%") y el data-state
 * (loading/complete) que un <span role="progressbar"> a mano no da.
 *
 * GEOMETRIA (fuente: el HTML del prototipo, que aplica los estilos inline)
 *
 *   dropzone    borde 1.5 discontinuo --tk-400 · radio 16 · fondo --tk-bg
 *               padding 28/24 · gap 10 · tile 52 r16 en surface con shadow-xs
 *               icono 26 · titulo 16 display 500 · pista mono 12 en --tk-600
 *   inline      alto 48 · radio 12 · inset 1px --tk-border-2 · padding 0 8 0 16
 *               clip 18 · placeholder 14 en --tk-500 · pildora 32 r8 mono 12
 *   fila        gap 12 · padding 12/14 · borde 1px --tk-border · radio 12
 *               tile 36 r8 · glifo 19 · nombre 13.5 · meta mono 11
 *               barra 5 r999 pista surface-2 · relleno tinta (pausado: --tk-500)
 *   miniatura   88 · radio 12 · quitar 22 circular · tile "+" con borde 1.5
 *   tipos       tile 44 r10 en surface-2 · glifo 22
 *
 * CUATRO DECISIONES DE COLOR EN TEMA OSCURO
 * -----------------------------------------
 * a. El borde de la fila en error es rgb(255,186,186) literal en el prototipo:
 *    un rojo claro que sobre fondo oscuro seria invisible como "suave" pero
 *    tampoco invierte. Se usa `border-red-soft` (--colours-purered-400,
 *    rgb(255,138,138)), que es la primitiva mas cercana del sistema. Es
 *    identica en ambos temas, y ahi esta bien: sobre la pagina oscura queda un
 *    borde rosado sobre el fondo teñido, que sigue leyendose como error.
 * b. El fondo de esa misma fila es rgba(255,46,46,0.03) en el prototipo. Se usa
 *    `bg-red-tint` (--colours-purered-transparent, la misma tinta al 0.05). Al
 *    ser alfa sobre lo que haya debajo, funciona en claro y en oscuro sin
 *    redefinirse. La diferencia 0.03 -> 0.05 es de dos centesimas y el sistema
 *    ya tiene ese valor tokenizado; no merece un token nuevo.
 * c. Los tiles de estado (listo, error) van con los pares tint- y fg-, que si
 *    invierten. El prototipo usa exactamente esos.
 * d. El circulo de quitar de la miniatura es rgba(11,11,11,0.7) en el
 *    prototipo: negro fijo. Se conserva la alfa pero sobre --tk-ink-strong
 *    invertido no funcionaria (en oscuro la tinta es casi blanca y el aspa
 *    blanca desapareceria). Se deja negro literal via color-mix sobre negro
 *    porque la miniatura SIEMPRE tiene una imagen debajo, y una imagen no
 *    cambia con el tema: la unica capa legible sobre cualquier foto es una
 *    oscura con el aspa clara. Es el mismo criterio que usa on-accent.
 */

/* ---------------------------------------------------------------------------
 * Iconos
 *
 * packages/ui no depende del paquete de Phosphor y no toco su package.json,
 * asi que los glifos se redibujan aqui con la geometria de Phosphor (viewBox
 * 256, trazo 16 = peso regular), igual que ya hace progress.tsx. Son
 * decorativos: el nombre accesible lo pone siempre el texto o el aria-label
 * del boton que los contiene.
 * ------------------------------------------------------------------------- */
const GLYPH = {
  viewBox: "0 0 256 256",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 16,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

type GlyphProps = React.SVGProps<SVGSVGElement>;

const UploadSimpleGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <path d="M128 160V40" />
    <path d="M80 88l48-48 48 48" />
    <path d="M40 152v64h176v-64" />
  </svg>
);

const ClockGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <circle cx="128" cy="128" r="96" />
    <path d="M128 72v56h48" />
  </svg>
);

const XGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <path d="M200 56 56 200" />
    <path d="M200 200 56 56" />
  </svg>
);

const PlayGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <path d="M72 40v176l144-88Z" />
  </svg>
);

const PlusGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <path d="M40 128h176" />
    <path d="M128 40v176" />
  </svg>
);

const PaperclipGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <path d="M209.7 122.3l-82.1 82a56 56 0 0 1-79.2-79.2l99.4-99.4a40 40 0 0 1 56.6 56.6l-99.5 99.4a24 24 0 0 1-33.9-33.9l83-82.9" />
  </svg>
);

/* El prototipo pide `ph-fill ph-check-circle`. Se usa el trazo, no el relleno,
 * a proposito: el relleno obliga a calar el check con el color del fondo, y la
 * fila puede posarse sobre surface, sobre page o sobre una tarjeta. El trazo es
 * agnostico del fondo y ya es el check que dibuja progress.tsx, asi que el
 * sistema no acaba con dos checks distintos. */
const CheckCircleGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <circle cx="128" cy="128" r="96" />
    <path d="M88 136l32 32 64-64" />
  </svg>
);

/* Silueta de hoja con la esquina doblada. Es la base de toda la familia
 * ph-file-*: los glifos con letras solo añaden el rotulo dentro. */
const FILE_OUTLINE = "M200 224H56a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8h96l56 56v128a8 8 0 0 1-8 8Z";
const FILE_FOLD = "M152 32v56h56";

const FileXGlyph = ({ className, ...props }: GlyphProps) => (
  <svg {...GLYPH} className={cn("shrink-0", className)} {...props}>
    <path d={FILE_OUTLINE} />
    <path d={FILE_FOLD} />
    <path d="M100 148l56 56" />
    <path d="M156 148l-56 56" />
  </svg>
);

/* ---------------------------------------------------------------------------
 * Tipo de archivo
 * ------------------------------------------------------------------------- */

export type FileKind = "pdf" | "jpg" | "png" | "doc" | "xls" | "csv" | "other";

/* El documento nombra siete formatos. Las extensiones que agrupa cada uno son
 * decision de implementacion: docx cae en DOC y xlsx en XLS porque el rotulo
 * del glifo solo tiene sitio para tres letras. */
const KIND_BY_EXTENSION: Record<string, FileKind> = {
  pdf: "pdf",
  jpg: "jpg",
  jpeg: "jpg",
  png: "png",
  doc: "doc",
  docx: "doc",
  rtf: "doc",
  xls: "xls",
  xlsx: "xls",
  csv: "csv",
};

const KIND_LABEL: Record<FileKind, string | null> = {
  pdf: "PDF",
  jpg: "JPG",
  png: "PNG",
  doc: "DOC",
  xls: "XLS",
  csv: "CSV",
  // OTRO no rotula: la hoja va limpia, como en el prototipo.
  other: null,
};

/** Deduce el formato a partir del nombre. `informe` (sin punto) cae en `other`. */
export function fileKindFromName(name: string): FileKind {
  const parts = name.toLowerCase().split(".");
  if (parts.length < 2) return "other";
  return KIND_BY_EXTENSION[parts[parts.length - 1] ?? ""] ?? "other";
}

/* Color por formato, tal cual lo pinta el bloque TIPOS DE ARCHIVO: solo PDF y
 * XLS se salen de la tinta. Los tres tokens invierten con el tema. */
const fileTypeIcon = cva("shrink-0", {
  variants: {
    kind: {
      pdf: "text-fg-error",
      xls: "text-fg-success",
      other: "text-ink-600",
      jpg: "text-ink",
      png: "text-ink",
      doc: "text-ink",
      csv: "text-ink",
    },
  },
  defaultVariants: { kind: "other" },
});

export interface FileTypeIconProps extends Omit<GlyphProps, "children"> {
  /** Formato explicito. Si no se pasa, se deduce de `name`. */
  kind?: FileKind;
  /** Nombre del archivo del que deducir el formato. */
  name?: string;
}

/**
 * Glifo del formato de un archivo, con el color que le da el documento.
 *
 * Es decorativo: nunca aporta nombre accesible. El nombre del archivo va
 * siempre en texto al lado.
 *
 * El color por formato SOLO vale suelto, como en el bloque TIPOS DE ARCHIVO. El
 * color se puede anular por `className` — `cn()` deja ganar a la ultima utilidad
 * de color — y eso es justo lo que hace `FileUploadItem`, cuyo tile ya tiñe el
 * glifo en los cinco estados.
 */
export const FileTypeIcon = React.forwardRef<SVGSVGElement, FileTypeIconProps>(
  function FileTypeIcon({ className, kind, name, ...props }, ref) {
    const resolved = kind ?? (name ? fileKindFromName(name) : "other");
    const label = KIND_LABEL[resolved];

    return (
      <svg
        ref={ref}
        {...GLYPH}
        className={cn(fileTypeIcon({ kind: resolved }), "size-[19px]", className)}
        {...props}
      >
        <path d={FILE_OUTLINE} />
        <path d={FILE_FOLD} />
        {label && (
          /* textLength + lengthAdjust fuerzan que las tres letras quepan en la
             hoja sea cual sea la fuente que herede el consumidor. Sin eso, una
             familia ancha se saldria del glifo. */
          <text
            x="128"
            y="196"
            textAnchor="middle"
            fontSize="64"
            fontWeight="700"
            textLength="140"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            stroke="none"
          >
            {label}
          </text>
        )}
      </svg>
    );
  },
);

/* ---------------------------------------------------------------------------
 * Zona de subida
 * ------------------------------------------------------------------------- */

const dropzone = cva(
  [
    "group relative cursor-pointer text-left select-none",
    "transition-[border-color,background-color,box-shadow] duration-140 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        /* 1.5px es literal en el prototipo, no un redondeo de 2. */
        dropzone: [
          "flex w-full flex-col items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-ink-400 bg-page px-6 py-7 text-center",
          "hover:not-disabled:border-ink-600",
          // El resalte al arrastrar encima lo pide el documento ("borde
          // punteado que se resalta"). Va por data-attr y no por :hover porque
          // durante un drag el navegador NO emite hover sobre el destino.
          "data-[dragging=true]:border-ink data-[dragging=true]:bg-surface-2",
          "disabled:border-edge disabled:bg-surface-2",
        ],
        /* Borde por sombra interior, no por border: asi los 48 de alto no se
           descuadran con el box-sizing del consumidor. */
        inline: [
          "flex h-control-l w-full items-center gap-2.5 rounded-lg py-0 pr-2 pl-4",
          "shadow-[inset_0_0_0_1px_var(--tk-border-2)]",
          "hover:not-disabled:shadow-[inset_0_0_0_1px_var(--tk-ink)]",
          "data-[dragging=true]:bg-surface-2 data-[dragging=true]:shadow-[inset_0_0_0_1px_var(--tk-ink)]",
          "disabled:bg-surface-2 disabled:shadow-[inset_0_0_0_1px_var(--tk-border)]",
        ],
      },
    },
    defaultVariants: { variant: "dropzone" },
  },
);

type DropzoneVariants = VariantProps<typeof dropzone>;

/**
 * Motivo por el que un archivo no se acepta.
 *
 * `count` es el sobrante de soltar varios sin `multiple`: el archivo era valido,
 * pero no cabia. Va por el mismo canal que los demas porque el criterio de la
 * seccion es que TODO descarte lleve motivo; si no, el consumidor no puede
 * decir "solo se admite uno" y el usuario ve desaparecer archivos sin razon.
 */
export type FileRejectionReason = "type" | "size" | "count";

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

export interface FileUploadProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange" | "value">, DropzoneVariants {
  /**
   * Fuerza el resalte de arrastre. Pensado para documentacion: durante un
   * arrastre real el navegador no emite `:hover` sobre el destino, asi que el
   * estado no se puede ver estatico de ninguna otra forma. Un arrastre en
   * curso siempre manda sobre este valor.
   */
  "data-dragging"?: boolean | "true" | "false";
  /** Formatos admitidos, con la misma sintaxis que el atributo `accept`. */
  accept?: string;
  /** Permite seleccionar y soltar varios archivos a la vez. */
  multiple?: boolean;
  /** Tamaño maximo por archivo, en bytes. Se valida en seleccion y en drop. */
  maxSize?: number;
  /** Recibe los archivos que pasan `accept` y `maxSize`. */
  onFilesAccepted?: (files: File[]) => void;
  /** Recibe los descartados con el motivo, para que el consumidor lo explique. */
  onFilesRejected?: (rejections: FileRejection[]) => void;
  /** Titulo de la zona. Solo en `variant="dropzone"`. */
  label?: React.ReactNode;
  /**
   * Formatos y limite, en mono. El documento pide decirlos SIEMPRE, asi que si
   * no se pasa se derivan de `accept` y `maxSize`. Para callarla del todo —una
   * pantalla que ya los explica arriba— pasa `hint={null}`.
   */
  hint?: React.ReactNode;
  /** Texto en gris del campo compacto. Solo en `variant="inline"`. */
  placeholder?: React.ReactNode;
  /** Rotulo de la pildora del campo compacto. */
  action?: React.ReactNode;
}

/* `accept` admite tres formas: ".pdf", "image/*" y "image/png". */
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/* Rotulos de formato a partir de `accept`, para la pista por defecto.
 * ".pdf" -> pdf · "image/*" -> image · "application/pdf" -> pdf. Se dejan en
 * minusculas: las mayusculas las pone `uppercase` en CSS, nunca toUpperCase(),
 * para que el lector de pantalla no deletree "P-D-F". */
function acceptLabels(accept?: string): string[] {
  if (!accept) return [];
  const labels: string[] = [];
  const seen = new Set<string>();

  for (const raw of accept.split(",")) {
    const rule = raw.trim().toLowerCase();
    if (!rule) continue;

    const label = rule.startsWith(".")
      ? rule.slice(1)
      : rule.endsWith("/*")
        ? rule.slice(0, -2)
        : (rule.split("/")[1] ?? rule);

    if (!label) continue;

    // ".jpg,.jpeg" o ".jpg,image/jpeg" son UN formato para quien lee la pista:
    // se agrupan por el mismo mapa que usa el glifo, y se enseña el primero.
    const key = KIND_BY_EXTENSION[label] ?? label;
    if (seen.has(key)) continue;
    seen.add(key);
    labels.push(label);
  }

  return labels;
}

/* Base 1024 y como mucho un decimal, con coma decimal porque el texto es
 * castellano: 10485760 -> "10 MB", 1572864 -> "1,5 MB". */
function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${String(Math.round(value * 10) / 10).replace(".", ",")} ${units[unit]}`;
}

/* La regla FORMATO Y PESO del documento es "di siempre los tipos y el limite
 * antes de subir", y `accept`/`maxSize` ya son ese dato. Derivar la pista evita
 * que una zona se quede muda por olvido del consumidor. */
function defaultHint(accept?: string, maxSize?: number): React.ReactNode {
  const labels = acceptLabels(accept);
  const limit =
    maxSize != null && Number.isFinite(maxSize) && maxSize > 0
      ? `hasta ${formatBytes(maxSize)}`
      : null;

  if (labels.length === 0 && !limit) return null;

  const list =
    labels.length > 1
      ? `${labels.slice(0, -1).join(", ")} o ${labels[labels.length - 1]}`
      : labels[0];

  return (
    <>
      {/* Solo la lista de formatos sube a mayusculas; "hasta 10 MB" no. */}
      {list && <span className="uppercase">{list}</span>}
      {list && limit && " · "}
      {limit}
    </>
  );
}

/**
 * Zona de subida del sistema Tikin.
 *
 * Dos formas con el mismo motor: `dropzone` para una pantalla dedicada a
 * subir, `inline` para un campo mas dentro de un formulario. Las dos aceptan
 * clic, teclado y arrastrar y soltar.
 *
 * POR QUE UN <button> Y NO UN <div role="button">
 * El foco, el Enter, el Espacio y el anuncio del lector de pantalla salen
 * gratis y correctos. El `<input type="file">` real va al lado, fuera del
 * boton — un control interactivo dentro de un boton es HTML invalido — oculto
 * con `sr-only`, sin foco propio y fuera del arbol de accesibilidad, para que
 * no haya dos paradas de tabulador que hacen lo mismo.
 *
 * El input se vacia despues de cada seleccion. Sin eso, elegir el MISMO archivo
 * dos veces seguidas no emite `change` la segunda vez y el usuario cree que la
 * app se ha colgado. Por eso tampoco hace falta exponer el input al consumidor:
 * el ref que se reenvia es el del boton, y un `.click()` sobre el abre el
 * selector igual que si el usuario lo hubiera pulsado.
 *
 * La validacion es de puerta, no de estado: este componente decide que entra
 * (`onFilesAccepted`) y que no (`onFilesRejected`), pero no guarda la lista ni
 * la sube. Eso vive en el consumidor, que es quien sabe de reintentos y de
 * progreso real.
 */
export const FileUpload = React.forwardRef<HTMLButtonElement, FileUploadProps>(function FileUpload(
  {
    className,
    variant = "dropzone",
    accept,
    multiple = false,
    maxSize,
    onFilesAccepted,
    onFilesRejected,
    label = (
      <>
        Arrastra un archivo o <span className="underline underline-offset-2">selecciona</span>
      </>
    ),
    hint,
    placeholder = "Adjunta un soporte…",
    action = "Examinar",
    disabled,
    onClick,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    children,
    // Se desestructuran para que el consumidor pueda seguir fijandolos pese a
    // que `{...props}` va delante. Sin esto, los atributos explicitos del JSX
    // los pisaban en silencio: `type` quedaba clavado en "button" y la story
    // Arrastrando, que fuerza data-dragging para poder verlo estatico, dejaba
    // de resaltar.
    type,
    "data-dragging": dataDragging,
    ...props
  },
  ref,
) {
  const localInput = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  /* `undefined` (no pasada) se deriva; `null` la silencia a proposito. Se
   * distinguen los dos casos para que el consumidor conserve la ultima palabra. */
  const hintNode = hint === undefined ? defaultHint(accept, maxSize) : hint;

  /* dragenter y dragleave burbujean tambien desde los hijos: al pasar el
   * puntero del titulo a la pista el navegador emite leave+enter y el borde
   * parpadearia. Se cuenta la profundidad y solo se apaga al llegar a cero. */
  const dragDepth = React.useRef(0);

  const emit = (list: FileList | File[] | null) => {
    const incoming = list ? Array.from(list) : [];
    if (incoming.length === 0) return;

    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    for (const file of incoming) {
      if (!matchesAccept(file, accept)) rejected.push({ file, reason: "type" });
      else if (maxSize != null && file.size > maxSize) rejected.push({ file, reason: "size" });
      else accepted.push(file);
    }

    // El input nativo ya limita a uno sin `multiple`, pero un drop puede
    // traer diez. Sin este recorte el consumidor recibiria mas de los que
    // pidio y tendria que volver a validarlo el mismo.
    const kept = multiple ? accepted : accepted.slice(0, 1);

    // Y el sobrante no se cae en silencio: sale por `onFilesRejected` con
    // motivo, como cualquier otro descarte.
    for (const file of accepted.slice(kept.length)) rejected.push({ file, reason: "count" });

    if (kept.length > 0) onFilesAccepted?.(kept);
    if (rejected.length > 0) onFilesRejected?.(rejected);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (disabled || event.defaultPrevented) return;
    localInput.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    emit(event.target.files);
    // Ver la nota del bloque de documentacion: permite repetir archivo.
    event.target.value = "";
  };

  /* Los cuatro manejadores de arrastre se COMPONEN con los del consumidor en
   * vez de dejar que `{...props}` los pise. Antes iban solo en el JSX y el
   * spread caia detras, asi que un `onDrop` de fuera sustituia al interno y la
   * zona dejaba de aceptar archivos sin avisar.
   *
   * Se llama primero al del consumidor y DESPUES siempre al interno. A
   * diferencia de `onClick`, aqui no se usa `defaultPrevented` como via de
   * escape: en arrastrar y soltar `preventDefault()` significa "acepto el
   * drop", es obligatorio en dragover, y muchos consumidores lo llaman por
   * costumbre. Tomarlo como "cancela lo interno" romperia justo el caso
   * normal. Quien quiera desactivar la zona tiene `disabled`. */
  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    onDragOver?.(event);
    if (disabled) return;
    // Sin preventDefault en dragover el navegador NUNCA dispara drop.
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  };

  const carriesFiles = (event: React.DragEvent<HTMLButtonElement>) => {
    const types = event.dataTransfer?.types;
    // Si el navegador no declara tipos, se asume que si: mas vale resaltar de
    // mas que dejar la zona muerta ante un origen que no los expone.
    if (!types) return true;
    return Array.from(types).includes("Files");
  };

  const handleDragEnter = (event: React.DragEvent<HTMLButtonElement>) => {
    onDragEnter?.(event);
    if (disabled || !carriesFiles(event)) return;
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    onDragLeave?.(event);
    if (disabled) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    onDrop?.(event);
    if (disabled) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    emit(event.dataTransfer?.files ?? null);
  };

  return (
    <>
      {/* Fuera del <button> y fuera del arbol de accesibilidad: solo existe
            para abrir el selector nativo del sistema. */}
      <input
        ref={localInput}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
      />
      {/* `{...props}` va DELANTE de todo lo que el componente necesita
            controlar. Asi, si mañana se añade otro manejador interno y alguien
            olvida desestructurarlo, el consumidor lo complementa por
            composicion explicita o no lo pisa; nunca lo anula en silencio. */}
      <button
        {...props}
        ref={ref}
        type={type ?? "button"}
        className={cn(dropzone({ variant }), className)}
        // El arrastre real manda; si no hay ninguno, vale lo que fije el
        // consumidor (asi la documentacion puede congelar el estado).
        data-dragging={dragging || dataDragging || undefined}
        disabled={disabled}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children ??
          (variant === "inline" ? (
            <>
              <PaperclipGlyph className="size-[18px] text-ink-600" />
              <span className="min-w-0 flex-1 truncate text-sm text-ink-500">{placeholder}</span>
              {/* Es un <span>, no un <button>: un boton dentro de otro es HTML
                    invalido y ademas partiria la zona en dos paradas de
                    tabulador que hacen exactamente lo mismo. */}
              <span className="inline-flex h-control-s shrink-0 items-center rounded-sm px-3.5 font-mono text-xs tracking-[0.02em] text-ink uppercase shadow-[inset_0_0_0_1px_var(--tk-ink)]">
                {action}
              </span>
            </>
          ) : (
            <>
              <span className="flex size-[52px] items-center justify-center rounded-xl bg-surface text-ink shadow-xs">
                <UploadSimpleGlyph className="size-[26px]" />
              </span>
              <span className="font-display text-base font-medium text-ink">{label}</span>
              {hintNode && <span className="font-mono text-xs text-ink-600">{hintNode}</span>}
            </>
          ))}
      </button>
    </>
  );
});

/* ---------------------------------------------------------------------------
 * Lista de archivos
 * ------------------------------------------------------------------------- */

export type FileUploadListProps = React.ComponentPropsWithoutRef<"ul">;

/**
 * Agrupa las filas de archivo.
 *
 * Lleva `role="list"` explicito porque Safari le quita la semantica de lista a
 * cualquier `<ul>` con `list-style: none`, que es justo lo que hace el reset de
 * Tailwind. Sin ese role el lector de pantalla no anuncia "lista de 3
 * elementos" y el usuario pierde la cuenta de lo que lleva subido.
 */
export const FileUploadList = React.forwardRef<HTMLUListElement, FileUploadListProps>(
  function FileUploadList({ className, ...props }, ref) {
    return (
      <ul ref={ref} role="list" className={cn("flex flex-col gap-2.5", className)} {...props} />
    );
  },
);

/* ---------------------------------------------------------------------------
 * Fila de archivo
 * ------------------------------------------------------------------------- */

/** Los seis estados que dibuja el documento; `error` cubre peso y formato. */
export type FileUploadStatus = "queued" | "uploading" | "paused" | "done" | "error";

const fileRow = cva("flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left", {
  variants: {
    status: {
      queued: "border-edge",
      uploading: "border-edge",
      paused: "border-edge",
      done: "border-edge",
      // Ver decisiones (a) y (b) de la cabecera.
      error: "border-red-soft bg-red-tint",
    },
  },
  defaultVariants: { status: "queued" },
});

const fileRowTile = cva("flex size-9 shrink-0 items-center justify-center rounded-sm", {
  variants: {
    status: {
      queued: "bg-surface-2 text-ink",
      uploading: "bg-surface-2 text-ink",
      paused: "bg-surface-2 text-ink",
      done: "bg-tint-success text-fg-success",
      error: "bg-tint-error text-fg-error",
    },
  },
  defaultVariants: { status: "queued" },
});

const fileRowMeta = cva("shrink-0 font-mono text-[11px]", {
  variants: {
    status: {
      queued: "text-ink-600",
      uploading: "text-ink-600",
      paused: "text-ink-600",
      done: "text-ink-600",
      error: "text-fg-error",
    },
  },
  defaultVariants: { status: "queued" },
});

/* Boton de icono de la fila. 24 de lado para llegar al area tactil minima sin
   engordar la fila, que mide 60 en total. */
const rowIconButton = cva(
  [
    "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-xs",
    "transition-colors duration-140 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 focus-visible:ring-offset-page",
  ],
  {
    variants: {
      tone: {
        muted: "text-ink-500 hover:text-ink",
        ink: "text-ink hover:text-ink-strong",
        error: "text-fg-error hover:opacity-80",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

/* Se omite `value` de los props de <li>: ahi es el numero de orden de la lista
 * (un entero), y aqui es el porcentaje de la barra, que ademas admite null. */
export interface FileUploadItemProps extends Omit<
  React.ComponentPropsWithoutRef<"li">,
  "children" | "value"
> {
  /** Nombre del archivo. De el sale tambien el glifo del formato. */
  name: string;
  /** Estado de la subida. */
  status?: FileUploadStatus;
  /**
   * Segunda linea en mono: "240 KB · listo", "supera 10 MB". Si no se pasa y
   * hay porcentaje, se muestra el porcentaje.
   */
  meta?: React.ReactNode;
  /** Porcentaje 0–100. Dibuja la barra en `uploading` y en `paused`. */
  value?: number | null;
  /**
   * Por que fallo. Solo cuenta en `status="error"` y solo cambia el glifo: el
   * documento dibuja el aspa (`ph-file-x`) en el error de peso y conserva la
   * hoja del formato en el de tipo, porque ahi el dato util es justo cual era
   * el formato. El texto del motivo lo escribe el consumidor en `meta`.
   */
  reason?: FileRejectionReason;
  /** Quita el archivo de la lista. El documento pide que SIEMPRE se pueda. */
  onRemove?: () => void;
  /** Vuelve a intentarlo. Solo se pinta en `status="error"`. */
  onRetry?: () => void;
  /** Reanuda una subida detenida. Solo se pinta en `status="paused"`. */
  onResume?: () => void;
  /** Rotulo del boton de reintento. Se pone en mayusculas por CSS. */
  retryLabel?: string;
}

/**
 * Fila de archivo con su estado.
 *
 * La fila no gestiona la subida: recibe `status` y `value` y los pinta. Quien
 * sube decide cuando cambian.
 *
 * Los tres textos de la fila — nombre, meta y rotulo de reintento — se escriben
 * en su capitalizacion natural. Las mayusculas del rotulo las pone `uppercase`
 * en CSS: si se aplicaran con `toUpperCase()` en JS, el lector de pantalla
 * deletrearia "R-E-I-N-T-E-N-T-A-R" y eso mismo se copiaria al portapapeles.
 */
export const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  function FileUploadItem(
    {
      className,
      name,
      status = "queued",
      meta,
      value = null,
      reason,
      onRemove,
      onRetry,
      onResume,
      retryLabel = "Reintentar",
      ...props
    },
    ref,
  ) {
    const hasValue = value != null && Number.isFinite(value);
    const percent = hasValue ? Math.min(Math.max(value, 0), 100) : 0;
    const showBar = hasValue && (status === "uploading" || status === "paused");

    // El porcentaje es la meta por defecto mientras sube: repetirlo en cada
    // llamada seria ruido en el consumidor.
    const metaNode = meta ?? (showBar ? `${Math.round(percent)}%` : null);

    return (
      <li ref={ref} data-status={status} className={cn(fileRow({ status }), className)} {...props}>
        <span className={fileRowTile({ status })}>
          {status === "error" && reason !== "type" ? (
            <FileXGlyph className="size-[19px]" />
          ) : (
            /* El tile SIEMPRE tiñe: tinta en cola/subiendo/pausado, verde en
               listo, rojo en error. `text-current` hace que el glifo herede ese
               color en vez de imponer el suyo por formato — sin esto un
               extracto.pdf pintaba el glifo en rojo dentro de una fila que no
               era de error, que es la senal mas confusa posible. */
            <FileTypeIcon name={name} className="text-current" />
          )}
        </span>

        {/* Dos maquetaciones, como el prototipo: con barra, nombre y meta
            comparten linea (justify-between) y la barra va debajo; sin barra,
            la meta cae DEBAJO del nombre y alineada a la izquierda. */}
        <div className={cn("flex min-w-0 flex-1 flex-col", showBar ? "gap-[5px]" : "gap-px")}>
          {showBar ? (
            <span className="flex items-center justify-between gap-3">
              <span className="truncate text-[13.5px] text-ink">{name}</span>
              {metaNode != null && <span className={fileRowMeta({ status })}>{metaNode}</span>}
            </span>
          ) : (
            <>
              <span className="truncate text-[13.5px] text-ink">{name}</span>
              {metaNode != null && (
                <span className={cn(fileRowMeta({ status }), "truncate")}>{metaNode}</span>
              )}
            </>
          )}

          {showBar && (
            /* La barra es `Progress`, no un role="progressbar" a mano: de Radix
               salen aria-valuetext y data-state, y el sistema no acaba con dos
               fuentes de verdad para la misma pieza. El tono en pausa se cambia
               por la variable que el propio Progress expone. */
            <Progress
              value={percent}
              aria-label={`Progreso de ${name}`}
              className={cn(
                "h-[5px]",
                // En pausa el relleno baja a gris: el documento lo pide para
                // que una fila detenida no se confunda con una que avanza.
                status === "paused" && "[--tk-progress-fill:var(--tk-500)]",
              )}
            />
          )}
        </div>

        {status === "queued" && <ClockGlyph className="size-[18px] shrink-0 text-ink-500" />}
        {status === "done" && <CheckCircleGlyph className="size-5 shrink-0 text-fg-success" />}

        {status === "error" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 cursor-pointer rounded-xs px-2 py-[5px] font-mono text-[11px] tracking-[0.02em] text-ink uppercase transition-colors duration-140 ease-out outline-none hover:bg-tint-error focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 focus-visible:ring-offset-page"
          >
            {retryLabel}
          </button>
        )}

        {status === "paused" && onResume && (
          <button
            type="button"
            onClick={onResume}
            aria-label={`Reanudar ${name}`}
            className={rowIconButton({ tone: "ink" })}
          >
            <PlayGlyph className="size-4" />
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Quitar ${name}`}
            className={rowIconButton({ tone: status === "error" ? "error" : "muted" })}
          >
            <XGlyph className="size-4" />
          </button>
        )}
      </li>
    );
  },
);

/* ---------------------------------------------------------------------------
 * Miniatura
 * ------------------------------------------------------------------------- */

const thumbnail = cva("relative size-[88px] shrink-0 overflow-hidden rounded-lg", {
  variants: {
    state: {
      ready: "border border-edge bg-surface-2",
      uploading: "flex items-center justify-center border border-edge bg-surface-2",
      add: [
        "flex cursor-pointer items-center justify-center border-[1.5px] border-dashed border-ink-400 text-ink-600",
        "transition-colors duration-140 ease-out",
        "hover:border-ink-600 hover:text-ink",
        "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page",
      ],
    },
  },
  defaultVariants: { state: "ready" },
});

export interface FileUploadThumbnailProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> {
  /** `ready` muestra la imagen, `uploading` el spinner, `add` el tile de "+". */
  state?: "ready" | "uploading" | "add";
  /** Origen de la imagen. Solo en `state="ready"`. */
  src?: string;
  /** Texto alternativo. Describe QUE es el comprobante, no "imagen". */
  alt?: string;
  /** Quita la miniatura. Solo en `state="ready"`. */
  onRemove?: () => void;
  /** Rotulo accesible del aspa. */
  removeLabel?: string;
  /** Se dispara al pulsar el tile de "+". Solo en `state="add"`. */
  onAdd?: () => void;
  /** Rotulo accesible del tile de "+". */
  addLabel?: string;
}

/**
 * Miniatura de una imagen ya subida, subiendose, o tile para añadir otra.
 *
 * En `state="add"` el elemento raiz es un `<button>` de verdad, no un `<div>`
 * con `onClick`: es la unica forma de que llegue el foco por tabulador y de que
 * Enter y Espacio lo activen sin escribir a mano el manejo de teclas.
 */
export const FileUploadThumbnail = React.forwardRef<HTMLElement, FileUploadThumbnailProps>(
  function FileUploadThumbnail(
    {
      className,
      state = "ready",
      src,
      alt = "",
      onRemove,
      removeLabel = "Quitar imagen",
      onAdd,
      addLabel = "Agregar imagen",
      ...props
    },
    ref,
  ) {
    if (state === "add") {
      return (
        <button
          // Un solo cast, y aqui: la raiz cambia de etiqueta con el estado y no
          // hay forma de expresarlo en un unico tipo sin volver el componente
          // generico, que complicaria su uso por una sola variante.
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onAdd}
          className={cn(thumbnail({ state }), className)}
          {...(props as React.ComponentPropsWithoutRef<"button">)}
        >
          <PlusGlyph className="size-[22px]" />
          <span className="sr-only">{addLabel}</span>
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(thumbnail({ state }), className)}
        {...props}
      >
        {state === "uploading" ? (
          <span
            // El estado ya lo anuncia el consumidor en su lista; aqui el
            // spinner es puramente visual.
            aria-hidden="true"
            className="size-[22px] animate-spin rounded-full border-2 border-edge-2 border-t-ink motion-reduce:animate-none"
          />
        ) : (
          <>
            {src && <img src={src} alt={alt} className="size-full object-cover" />}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={removeLabel}
                /* Negro fijo con alfa, no tinta del tema: debajo hay una foto,
                   que no invierte. Ver decision (d) de la cabecera. */
                className="absolute top-1 right-1 inline-flex size-[22px] cursor-pointer items-center justify-center rounded-full bg-[rgba(11,11,11,0.7)] text-white outline-none hover:bg-[rgba(11,11,11,0.85)] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 focus-visible:ring-offset-page"
              >
                <XGlyph className="size-[13px]" />
              </button>
            )}
          </>
        )}
      </div>
    );
  },
);
