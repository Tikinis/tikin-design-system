#!/usr/bin/env node
/**
 * Genera registry.json a partir del codigo fuente de @tikin/ui.
 *
 *     node scripts/generar-registry.mjs
 *
 * Es la pieza que hace que la distribucion hibrida no cueste el doble de
 * mantenimiento: packages/ui/src/components/*.tsx es la UNICA fuente. De ahi
 * salen las dos vias de consumo:
 *
 *   npm       tsup compila el paquete
 *   registry  este script produce registry.json y `shadcn build` lo convierte
 *             en los JSON que sirve el sitio de documentacion
 *
 * Las dependencias no se escriben a mano: se deducen de los imports reales de
 * cada componente, asi que no pueden quedar desfasadas.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTES = join(RAIZ, "packages/ui/src/components");

// Sin esto, el consumidor se instala el paquete pero no el CSS de los tokens.
const BASE_URL =
  process.env.TIKIN_REGISTRY_URL ?? "https://tikinis.github.io/tikin-design-system";

const esFuente = (f) =>
  f.endsWith(".tsx") && !f.endsWith(".test.tsx") && !f.endsWith(".stories.tsx");

/** Paquetes npm que puede importar un componente. */
const NPM = ["radix-ui", "class-variance-authority", "clsx", "tailwind-merge"];

function analizar(nombre) {
  const ruta = join(COMPONENTES, `${nombre}.tsx`);
  const src = readFileSync(ruta, "utf8");

  const imports = [...src.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);

  const dependencies = NPM.filter((p) => imports.includes(p));
  // cn vive en lib/, no es un componente: viaja como item propio del registry.
  const registryDependencies = [];
  if (imports.some((i) => i.endsWith("lib/cn"))) registryDependencies.push(`${BASE_URL}/r/cn.json`);
  for (const i of imports) {
    const m = i.match(/^\.\/([a-z0-9-]+)$/);
    if (m) registryDependencies.push(`${BASE_URL}/r/${m[1]}.json`);
  }

  // Cabecera: "Seccion 09 · Chips & badges — MIXTO."
  const cab = src.match(/\/\*\s*Seccion\s+(\d+)\s*·\s*([^—\n]+)—\s*(CANONICO|EXTENSION|MIXTO)/);
  const seccion = cab ? cab[1] : null;
  const titulo = cab ? cab[2].trim() : nombre;
  const origen = cab ? cab[3] : "DESCONOCIDO";

  const exports = [...src.matchAll(/^export\s+(?:const|function)\s+(\w+)/gm)].map((m) => m[1]);

  const etiqueta = {
    CANONICO: "Del archivo de Figma",
    EXTENSION: "Extension construida con los tokens del sistema",
    MIXTO: "Mezcla partes del archivo con extensiones",
    DESCONOCIDO: "Sin clasificar",
  }[origen];

  return {
    name: nombre,
    type: "registry:ui",
    title: titulo,
    description:
      (seccion ? `Seccion ${seccion} del sistema de diseño. ` : "") +
      `${etiqueta}. Exporta: ${exports.join(", ")}.`,
    dependencies,
    registryDependencies: [...new Set(registryDependencies)],
    files: [
      {
        path: `packages/ui/src/components/${nombre}.tsx`,
        type: "registry:ui",
        target: `components/ui/${nombre}.tsx`,
      },
    ],
  };
}

const nombres = readdirSync(COMPONENTES)
  .filter(esFuente)
  .map((f) => f.replace(/\.tsx$/, ""));

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "tikin",
  homepage: BASE_URL,
  items: [
    {
      name: "cn",
      type: "registry:lib",
      title: "cn",
      description:
        "Une clases condicionales y resuelve conflictos de Tailwind. Lo usan todos los componentes.",
      dependencies: ["clsx", "tailwind-merge"],
      files: [{ path: "packages/ui/src/lib/cn.ts", type: "registry:lib", target: "lib/cn.ts" }],
    },
    ...nombres.sort().map(analizar),
  ],
};

writeFileSync(join(RAIZ, "registry.json"), JSON.stringify(registry, null, 2) + "\n");

const sinClasificar = registry.items.filter((i) => i.description.includes("Sin clasificar"));
console.log(`registry.json generado con ${registry.items.length} items.`);
if (sinClasificar.length) {
  console.log(
    `Aviso: ${sinClasificar.length} sin cabecera de seccion: ${sinClasificar.map((i) => i.name).join(", ")}`,
  );
}
