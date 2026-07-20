#!/usr/bin/env node
/**
 * Reescribe los imports relativos de los JSON del registry al alias "@/".
 *
 *     node scripts/alias-registry.mjs apps/storybook/public/r
 *
 * Dentro del monorepo un componente importa asi:
 *
 *     import { cn } from "../lib/cn";        // packages/ui/src/components -> ../lib
 *
 * Pero `shadcn add` copia ese fichero a components/ui/ del consumidor, donde
 * "../lib/cn" apunta a components/lib/cn — que no existe, porque cn aterriza
 * en lib/cn.ts en la raiz. Sin esta reescritura el codigo copiado no compila.
 *
 * El alias "@/" es la convencion de shadcn y el CLI ya lo remapea al alias
 * real que tenga configurado cada proyecto en su components.json.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("Uso: node scripts/alias-registry.mjs <directorio-del-registry>");
  process.exit(1);
}

const REGLAS = [
  // ../lib/cn -> @/lib/cn
  [/from "\.\.\/lib\/([a-z0-9-]+)"/g, 'from "@/lib/$1"'],
  // ./boton-hermano -> @/components/ui/boton-hermano
  [/from "\.\/([a-z0-9-]+)"/g, 'from "@/components/ui/$1"'],
];

let ficheros = 0;
let reescritos = 0;

for (const nombre of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const ruta = join(dir, nombre);
  const datos = JSON.parse(readFileSync(ruta, "utf8"));
  if (!Array.isArray(datos.files)) continue;

  let tocado = false;
  for (const f of datos.files) {
    if (typeof f.content !== "string") continue;
    const antes = f.content;
    for (const [patron, reemplazo] of REGLAS) f.content = f.content.replace(patron, reemplazo);
    if (f.content !== antes) {
      tocado = true;
      reescritos++;
    }
  }

  ficheros++;
  if (tocado) writeFileSync(ruta, JSON.stringify(datos, null, 2) + "\n");
}

console.log(`Imports reescritos al alias @/ en ${reescritos} de ${ficheros} ficheros del registry.`);

// Red de seguridad: si queda algun relativo hacia fuera, el codigo copiado no
// compilaria en casa del consumidor y es mejor enterarse aqui que alli.
const restos = [];
for (const nombre of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const datos = JSON.parse(readFileSync(join(dir, nombre), "utf8"));
  for (const f of datos.files ?? []) {
    if (typeof f.content === "string" && /from "\.\.?\//.test(f.content)) restos.push(nombre);
  }
}
if (restos.length) {
  console.error(`\nQuedan imports relativos sin reescribir en: ${[...new Set(restos)].join(", ")}`);
  process.exit(1);
}
