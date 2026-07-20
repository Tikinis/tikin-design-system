#!/usr/bin/env node
/**
 * Barrido visual de TODAS las stories, en claro y en oscuro.
 *
 *     pnpm build:storybook
 *     node scripts/auditar-stories.mjs apps/storybook/storybook-static
 *
 * Existe porque medir un componente suelto no escala a 37, y mirarlos a ojo
 * uno por uno no es repetible. Esto recorre cada story en los dos temas y busca
 * las cuatro formas en que un sistema de diseño se rompe sin que nadie se
 * entere:
 *
 *   1. Variables CSS sin resolver — un `var(--tk-loquesea)` mal escrito no
 *      falla, simplemente no pinta. Es el fallo mas silencioso de todos.
 *   2. Texto invisible — tinta y fondo iguales o casi. Es lo que paso con el
 *      menu abierto en hover (contraste 1.06:1) y con la media card en oscuro.
 *   3. Colores fijos que no invierten — si un elemento se pinta EXACTAMENTE
 *      igual en claro y en oscuro teniendo color de fondo propio, o es
 *      deliberado (acentos de marca, `.tk-static`) o se colo un literal.
 *   4. Errores de consola.
 *
 * No sustituye a mirar el resultado: detecta lo mecanico, no si algo es feo.
 */

import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createServer } from "node:http";
import { stat, readFile, mkdir } from "node:fs/promises";
import { writeFileSync, existsSync } from "node:fs";

const dir = resolve(process.argv[2] ?? "apps/storybook/storybook-static");

/* El barrido completo son ~700 vistas y tarda de sobra para que cualquier
   supervisor lo mate a media ejecucion. Por eso va por tramos y va volcando el
   resultado segun avanza: se puede reanudar y nunca se pierde lo hecho.

     node scripts/auditar-stories.mjs <dir> --desde 0 --hasta 120
     node scripts/auditar-stories.mjs <dir>            # todo de una vez

   Los parciales se acumulan en .review/audit-visual.json. */
const arg = (nombre, pordefecto) => {
  const i = process.argv.indexOf(nombre);
  return i === -1 ? pordefecto : Number(process.argv[i + 1]);
};
const DESDE = arg("--desde", 0);
const HASTA = arg("--hasta", Infinity);
const SALIDA = resolve(".review/audit-visual.json");

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".map": "application/json",
};

/** Servidor estatico minimo: file:// no vale, Storybook hace fetch de su index. */
function servir(raiz) {
  return new Promise((listo) => {
    const s = createServer(async (req, res) => {
      try {
        const ruta = join(raiz, decodeURIComponent(req.url.split("?")[0]));
        const info = await stat(ruta).catch(() => null);
        const final = info?.isDirectory() ? join(ruta, "index.html") : ruta;
        const cuerpo = await readFile(final);
        const ext = final.slice(final.lastIndexOf("."));
        res.writeHead(200, { "content-type": MIME[ext] ?? "application/octet-stream" });
        res.end(cuerpo);
      } catch {
        res.writeHead(404).end("no encontrado");
      }
    });
    s.listen(0, () => listo({ servidor: s, puerto: s.address().port }));
  });
}

/** Luminancia relativa segun WCAG, para el contraste. */
function luminancia([r, g, b]) {
  // Se ignora un cuarto componente si viene: aqui ya llega compuesto.
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/* Lo que se ejecuta DENTRO de la pagina de cada story. Devuelve datos crudos;
   el analisis se hace fuera, en Node, para poder razonar con calma. */
function recolectar() {
  /* El color se convierte con un canvas de 1x1 en vez de parseando la cadena.
     Tailwind 4 compila los modificadores de opacidad a color-mix(in oklab, …) y
     Chromium los devuelve como `oklab(… / .45)`; antes ya habian aparecido
     `color(srgb …)` y `rgba()`. Perseguir formatos uno a uno es una carrera que
     se pierde: el canvas acepta cualquier color CSS valido y devuelve sus
     componentes exactos, hoy y cuando aparezca el siguiente formato. */
  const lienzo = document.createElement("canvas");
  lienzo.width = 1;
  lienzo.height = 1;
  const ctx = lienzo.getContext("2d", { willReadFrequently: true });
  const cache = new Map();

  const rgb = (css) => {
    if (!css || css === "transparent") return null;
    if (cache.has(css)) return cache.get(css);
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css; // si el color no es valido, se queda el negro anterior
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    const r = d[3] === 0 ? null : [d[0], d[1], d[2], d[3] / 255];
    cache.set(css, r);
    return r;
  };

  const fondoEfectivo = (el) => {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    /* Se recogen TODAS las capas desde el elemento hacia atras y se componen,
       en vez de quedarse con la primera opaca. Asi un velo semitransparente
       (el cristal del eyebrow, un scrim) aporta su color en la proporcion que
       le toca, que es lo que hace el navegador.

       Se usa la pila de pintado y no los ancestros porque hay fondos que pinta
       un HERMANO —la banda lima del rango del date picker va en una capa detras
       de la celda, no envolviendola— y el recorrido por padres se los saltaba.
       La pila viene de ARRIBA abajo, asi que se empieza en el propio elemento:
       lo anterior esta DELANTE de el y no es su fondo. */
    const pila = x >= 0 && y >= 0 ? document.elementsFromPoint(x, y) : [];
    const yo = pila.indexOf(el);
    const capas = [];
    for (const n of yo === -1 ? [el] : pila.slice(yo)) {
      const cs = getComputedStyle(n);
      /* Un degradado o una imagen no tienen UN color: el contraste cambia a lo
         largo del elemento y habria que muestrear pixeles. Antes de dar un
         numero inventado, se declara desconocido y el texto no se juzga. Es lo
         que pasa con el scrim de la media card, que es un linear-gradient. */
      if (cs.backgroundImage && cs.backgroundImage !== "none") return null;
      const c = rgb(cs.backgroundColor);
      if (!c) continue;
      capas.push(c);
      if (c[3] >= 1) break; // opaca: lo de mas atras ya no se ve
    }
    if (capas.length) {
      // De la mas honda a la mas superficial, componiendo sobre blanco.
      let base = [255, 255, 255];
      for (const c of capas.reverse()) {
        const a = c[3];
        base = [0, 1, 2].map((i) => Math.round(c[i] * a + base[i] * (1 - a)));
      }
      return base;
    }
    // Fuera de la ventana no hay composicion que consultar: se cae al recorrido
    // por ancestros, que sigue siendo mejor que nada.
    let n = el;
    while (n && n !== document.documentElement) {
      const c = rgb(getComputedStyle(n).backgroundColor);
      if (c) return c;
      n = n.parentElement;
    }
    return rgb(getComputedStyle(document.body).backgroundColor) ?? [255, 255, 255];
  };

  const varsSinResolver = [];
  const textos = [];
  const fondos = [];

  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);

    // 1. Variables sin resolver: el valor calculado conserva el var() literal.
    for (const prop of ["color", "background-color", "border-color", "box-shadow", "fill"]) {
      const v = cs.getPropertyValue(prop);
      if (v && v.includes("var(--")) {
        varsSinResolver.push({ etiqueta: el.tagName.toLowerCase(), prop, valor: v.slice(0, 90) });
      }
    }

    const propio = rgb(cs.backgroundColor);
    if (propio) fondos.push({ sel: el.tagName.toLowerCase(), color: propio });

    // 2. Texto: solo elementos con texto propio y visibles.
    const texto = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join("");
    if (!texto) continue;
    if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
    const caja = el.getBoundingClientRect();
    if (caja.width < 2 || caja.height < 2) continue;

    const tinta = rgb(cs.color);
    if (!tinta) continue;
    const fondo = fondoEfectivo(el);
    // null = hay un degradado o una imagen detras y no se puede dar un numero.
    if (!fondo) continue;
    // WCAG 1.4.3 exime a los controles inactivos del minimo de contraste, asi
    // que se marcan en vez de tratarlos como el resto: un disabled apagado es
    // correcto, pero uno ilegible del todo sigue siendo mal diseño.
    const inactivo = Boolean(
      el.closest(
        "[disabled],[aria-disabled='true'],[data-disabled],[data-state='checked'][data-disabled]",
      ),
    );
    textos.push({
      texto: texto.slice(0, 40),
      tinta,
      fondo,
      tam: parseFloat(cs.fontSize),
      peso: cs.fontWeight,
      inactivo,
    });
  }

  return { varsSinResolver, textos, fondos };
}

const { servidor, puerto } = await servir(dir);
const base = `http://127.0.0.1:${puerto}`;

const indice = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
const todas = Object.values(indice.entries ?? indice.stories ?? {}).filter(
  (e) => e.type !== "docs",
);
const stories = todas.slice(DESDE, HASTA === Infinity ? undefined : HASTA);

const navegador = await chromium.launch();

/* UNA sola pestaña para las ~700 vistas. Abrir una por vista agota los recursos
   del navegador y acaba tumbandolo a mitad del barrido ("Target page, context or
   browser has been closed"). Navegar sobre la misma pestaña es ademas mas
   rapido: no repite el arranque del contexto. */
const pagina = await navegador.newPage({ viewport: { width: 900, height: 700 } });
let errores = [];
pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));
pagina.on("pageerror", (e) => errores.push(String(e)));
await mkdir(resolve(".review"), { recursive: true });
const previo = existsSync(SALIDA) && DESDE > 0 ? JSON.parse(readFileSync(SALIDA, "utf8")) : null;
const problemas = previo?.problemas ?? [];
let revisadas = previo?.revisadas ?? 0;
const volcar = () =>
  writeFileSync(SALIDA, JSON.stringify({ revisadas, total: todas.length * 2, problemas }, null, 2));

for (const story of stories) {
  for (const tema of ["Claro", "Oscuro"]) {
    errores = [];
    const url = `${base}/iframe.html?id=${story.id}&globals=theme:${tema}&viewMode=story`;
    try {
      await pagina.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

      /* Esperar por TIEMPO no vale y ademas mentia. Reutilizando la pestaña,
         al saltar de una story clara a una oscura hay un instante en que el
         texto ya resuelve con los tokens del tema nuevo y el fondo todavia no:
         medir ahi daba "texto invisible" a punta pala — 189 avisos de tinta
         casi negra sobre fondo casi negro que en el navegador se ven
         perfectamente. Se espera a que el fondo del body sea EL del tema
         pedido, que es la señal de que el cambio ya aterrizo. */
      await pagina.waitForFunction(
        (t) => {
          const bg = getComputedStyle(document.body).backgroundColor;
          return t === "Oscuro" ? bg === "rgb(18, 18, 18)" : bg === "rgb(250, 248, 244)";
        },
        tema,
        { timeout: 10000 },
      );
      // Y un respiro corto para las animaciones de entrada (stagger, count-up).
      await pagina.waitForTimeout(120);
      const datos = await pagina.evaluate(recolectar);

      for (const v of datos.varsSinResolver) {
        problemas.push({
          story: story.id,
          tema,
          tipo: "var-sin-resolver",
          detalle: `<${v.etiqueta}> ${v.prop}: ${v.valor}`,
        });
      }

      for (const t of datos.textos) {
        const ratio = contraste(t.tinta, t.fondo);
        // Umbral WCAG AA: 3:1 para texto grande, 4.5:1 para el resto.
        const grande = t.tam >= 24 || (t.tam >= 18.66 && Number(t.peso) >= 700);
        const minimo = grande ? 3 : 4.5;
        if (t.inactivo) {
          // Solo interesa el inactivo que ni siquiera se intuye.
          if (ratio < 2) {
            problemas.push({
              story: story.id,
              tema,
              tipo: "inactivo-ilegible",
              par: `${t.tinta.join(",")} sobre ${t.fondo.join(",")}`,
              detalle: `"${t.texto}" ${ratio.toFixed(2)}:1 ${t.tam}px`,
            });
          }
        } else if (ratio < minimo) {
          problemas.push({
            story: story.id,
            tema,
            tipo: ratio < 1.5 ? "texto-invisible" : "contraste-bajo",
            par: `${t.tinta.join(",")} sobre ${t.fondo.join(",")}`,
            detalle: `"${t.texto}" ${ratio.toFixed(2)}:1 (min ${minimo}) ${t.tam}px`,
          });
        }
      }

      for (const e of errores) {
        problemas.push({ story: story.id, tema, tipo: "error-consola", detalle: e.slice(0, 140) });
      }

      revisadas++;
      // Volcado periodico: si algo corta el proceso, no se pierde el trabajo.
      if (revisadas % 40 === 0) volcar();
    } catch (e) {
      problemas.push({ story: story.id, tema, tipo: "no-carga", detalle: String(e).slice(0, 140) });
    }
  }
}

await pagina.close();
await navegador.close();
volcar();
servidor.close();

/* Informe. Se agrupa por tipo porque un mismo defecto suele aparecer en muchas
   stories a la vez y leerlo story por story esconde el patron. */
const porTipo = {};
for (const p of problemas) (porTipo[p.tipo] ??= []).push(p);

console.log(`\n${stories.length} stories × 2 temas = ${revisadas} vistas revisadas\n`);

if (!problemas.length) {
  console.log("Sin problemas mecanicos. Esto NO dice que se vea bien: solo que");
  console.log("no hay variables sin resolver, texto ilegible ni errores.\n");
} else {
  for (const [tipo, lista] of Object.entries(porTipo).sort((a, b) => b[1].length - a[1].length)) {
    const porPar = {};
    for (const p of lista) (porPar[p.par ?? p.detalle] ??= []).push(p);
    const pares = Object.entries(porPar).sort((a, b) => b[1].length - a[1].length);
    console.log(`\n### ${tipo} — ${lista.length} avisos, ${pares.length} causas distintas`);
    for (const [par, casos] of pares.slice(0, 10)) {
      const ej = casos[0];
      console.log(`  ${par}`);
      console.log(`      ${ej.detalle}`);
      console.log(`      ${casos.length} apariciones · p.ej. [${ej.tema}] ${ej.story}`);
    }
    if (pares.length > 10) console.log(`  … y ${pares.length - 10} causas mas`);
  }
  console.log("");
}

// Solo lo que impide leer la interfaz rompe el build.
const graves = problemas.filter((p) =>
  ["var-sin-resolver", "texto-invisible", "no-carga", "error-consola"].includes(p.tipo),
);
if (graves.length) {
  console.error(`${graves.length} problemas graves.\n`);
  process.exit(1);
}
