#!/usr/bin/env node
/**
 * Guarda de los tokens exportados de Figma.
 *
 *     node scripts/verificar-tokens.mjs
 *
 * figma.css se regenera cada vez que alguien re-exporta las variables del
 * archivo. Ese fichero ya ha llegado dos veces con problemas que no fallan por
 * si solos — simplemente pintan mal o dejan de pintar — y que costo dias
 * encontrar la primera vez. Esta guarda los detecta en el sitio y en el momento
 * en que se reintroducen, en vez de en producto.
 *
 * Comprueba tres cosas:
 *
 *   1. COLISIONES DE NAMESPACE. Figma exporta nombres como --radius-md o
 *      --spacing-2 que son exactamente los que Tailwind 4 usa para su tema, y
 *      ademas SIN unidad. Sin neutralizar, `rounded-md` compila a
 *      "border-radius: 8", que es invalido. Se neutralizan metiendo figma.css
 *      en su propia capa CSS (ver theme.css); aqui se verifica que esa
 *      neutralizacion sigue en pie.
 *
 *   2. PLACEHOLDERS. Figma exporta literalmente "String value" y ceros cuando
 *      una variable no tiene valor en ese modo. El bloque .dark de los chips
 *      llego asi. Se corrigen en semantic.css; aqui se verifica que cada
 *      placeholder tiene su correccion.
 *
 *   3. TOKENS QUE NO INVIERTEN. Una variable de color definida en :root y NO
 *      redefinida en .dark se queda con su valor claro en tema oscuro. A veces
 *      es correcto (acentos de marca) y a veces es un agujero — es lo que
 *      pasaba con el fondo del boton primario, negro sobre negro. Se listan
 *      para que la ausencia sea una decision y no un descuido.
 *
 * Sale con codigo 1 solo si hay algo SIN neutralizar. Lo ya resuelto se
 * informa, no rompe.
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS = join(RAIZ, "packages/tokens/src");

const figma = readFileSync(join(TOKENS, "figma.css"), "utf8");
const semantico = readFileSync(join(TOKENS, "semantic.css"), "utf8");
const tema = readFileSync(join(TOKENS, "theme.css"), "utf8");

/* Todo el codigo de los componentes, concatenado. Un token roto solo importa si
   alguien lo consume: el chip, por ejemplo, esquiva --chip-typo-size-* usando
   valores literales y explicando por que. Eso es una mitigacion tan valida como
   corregirlo, y la guarda tiene que reconocerla o gritaria en falso para
   siempre. */
const COMPONENTES = join(RAIZ, "packages/ui/src/components");
const codigo = readdirSync(COMPONENTES)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx") && !f.endsWith(".stories.tsx"))
  .map((f) => readFileSync(join(COMPONENTES, f), "utf8"))
  .join("\n");

/** ¿Alguien lo lee de verdad con var()? Las menciones en comentarios no cuentan. */
const seUsa = (token) => new RegExp(`var\\(\\s*${token}\\b`).test(codigo);

/** Declaraciones de un bloque, en orden. */
function declaraciones(css, selector) {
  const i = css.indexOf(selector);
  if (i === -1) return new Map();
  const abre = css.indexOf("{", i);
  if (abre === -1) return new Map();
  let prof = 1;
  let j = abre + 1;
  while (j < css.length && prof) {
    if (css[j] === "{") prof += 1;
    else if (css[j] === "}") prof -= 1;
    j += 1;
  }
  const cuerpo = css.slice(abre + 1, j - 1);
  return new Map(
    [...cuerpo.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  );
}

const claro = declaraciones(figma, ":root {");
// El selector del bloque oscuro se busca por su primera linea: Prettier lo
// parte en varias y una cadena literal con la coma dejaria de casar.
const oscuro = declaraciones(figma, ':root[data-theme="dark"]');

const fallos = [];
const resueltos = [];

/* ---- 1. Colisiones con los namespaces de tema de Tailwind 4 ---- */

// Namespaces que Tailwind 4 lee de las variables CSS para generar utilidades.
const NAMESPACES = [
  "--color-",
  "--font-",
  "--text-",
  "--font-weight-",
  "--tracking-",
  "--leading-",
  "--breakpoint-",
  "--container-",
  "--spacing",
  "--radius-",
  "--shadow-",
  "--inset-shadow-",
  "--drop-shadow-",
  "--blur-",
  "--perspective-",
  "--aspect-",
  "--ease-",
  "--animate-",
];

const enCapa = /@import\s+"\.\/figma\.css"\s+layer\(/.test(tema);
const colisiones = [...claro.keys()].filter((n) => NAMESPACES.some((ns) => n.startsWith(ns)));

if (colisiones.length) {
  if (enCapa) {
    resueltos.push(
      `${colisiones.length} nombres chocan con los namespaces de Tailwind ` +
        `(${colisiones.slice(0, 4).join(", ")}${colisiones.length > 4 ? ", …" : ""}), ` +
        `neutralizados por la capa CSS de theme.css`,
    );
  } else {
    fallos.push(
      `theme.css ya NO importa figma.css dentro de una capa, y hay ${colisiones.length} ` +
        `nombres que chocan con los namespaces de tema de Tailwind: ` +
        `${colisiones.join(", ")}.\n    Sin la capa ganan a @layer theme y rompen las utilidades ` +
        `correspondientes (rounded-*, text-*, shadow-*…).`,
    );
  }
}

/* ---- 2. Placeholders de Figma ---- */

const PLACEHOLDER = /^"?String value"?$/;
for (const [bloque, mapa] of [
  ["claro", claro],
  ["oscuro", oscuro],
]) {
  for (const [nombre, valor] of mapa) {
    const esPlaceholder =
      PLACEHOLDER.test(valor) || (/typo-size|font-size/.test(nombre) && valor === "0");
    if (!esPlaceholder) continue;
    // ¿Lo corrige la capa semantica, que va sin capa y por tanto gana?
    if (semantico.includes(nombre)) {
      resueltos.push(
        `${nombre} llega como placeholder (${valor}) en ${bloque}, corregido en semantic.css`,
      );
    } else if (!seUsa(nombre)) {
      resueltos.push(
        `${nombre} llega como placeholder (${valor}) en ${bloque}, pero ningun componente lo lee`,
      );
    } else {
      fallos.push(
        `${nombre} vale ${valor} en el bloque ${bloque} — es un placeholder de Figma, no un ` +
          `valor — y HAY componentes que lo leen con var().\n    Corrigelo en semantic.css, ` +
          `sustituyelo por un literal en el componente, o arregla la variable en el archivo.`,
      );
    }
  }
}

/* ---- 3. Colores que no invierten ---- */

const esColor = (v) => /(^|\s)(rgb|rgba|#|var\(--colours-|var\(--tailwind-)/.test(v);
const sinOscuro = [...claro.entries()]
  .filter(([n, v]) => esColor(v) && !oscuro.has(n))
  // Las primitivas son la paleta cruda: no se espera que inviertan.
  .filter(
    ([n]) =>
      !n.startsWith("--colours-") &&
      !n.startsWith("--tailwind-colors-") &&
      !n.startsWith("--primary-"),
  )
  .map(([n]) => n);

const sinOscuroUsados = sinOscuro.filter(seUsa);
if (sinOscuroUsados.length) {
  fallos.push(
    `${sinOscuroUsados.length} color(es) NO se redefinen en .dark y aun asi los lee un ` +
      `componente: ${sinOscuroUsados.join(", ")}.\n    En tema oscuro conservaran su valor ` +
      `claro. Es lo que hacia que el boton primario saliera negro sobre negro; usa el ` +
      `--tk-* equivalente, que si invierte.`,
  );
}

if (sinOscuro.length) {
  resueltos.push(
    `${sinOscuro.length} colores no se redefinen en .dark y conservan su valor claro: ` +
      `${sinOscuro.slice(0, 6).join(", ")}${sinOscuro.length > 6 ? ", …" : ""}.\n    ` +
      `Revisa que ninguno se use como fondo o tinta principal — es lo que hacia que el ` +
      `boton primario saliera negro sobre negro. Los componentes afectados usan --tk-* en su lugar.`,
  );
}

/* ---- Informe ---- */

console.log(
  `\nfigma.css: ${claro.size} variables en claro, ${oscuro.size} redefinidas en oscuro\n`,
);

for (const r of resueltos) console.log(`  ok   ${r}`);
if (fallos.length) {
  console.error("");
  for (const f of fallos) console.error(`  FALLO  ${f}`);
  console.error(`\n${fallos.length} problema(s) sin neutralizar en los tokens exportados.\n`);
  process.exit(1);
}
console.log("\nSin problemas sin neutralizar.\n");
