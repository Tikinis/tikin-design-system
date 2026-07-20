#!/usr/bin/env node
/**
 * Prueba de instalacion real.
 *
 * Crea un proyecto Vite limpio FUERA del monorepo, instala los tarballs
 * empaquetados como lo haria cualquiera de la empresa, y compila.
 *
 *     node scripts/prueba-instalacion.mjs /tmp/packs
 *
 * Existe porque `pnpm build` dentro del workspace no demuestra nada sobre la
 * instalacion: resuelve @tikin/tokens por enlace del workspace, no por el
 * campo exports del paquete publicado. Un exports mal puesto, un fichero que
 * falte en "files" o un peer sin declarar solo salen aqui.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const packs = process.argv[2];
if (!packs) {
  console.error("Uso: node scripts/prueba-instalacion.mjs <directorio-con-tarballs>");
  process.exit(1);
}

const tarballs = readdirSync(packs)
  .filter((f) => f.endsWith(".tgz"))
  .map((f) => join(packs, f));

if (tarballs.length < 2) {
  console.error(`Esperaba los tarballs de tokens y ui en ${packs}, encontre: ${tarballs.length}`);
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), "tikin-consumidor-"));
const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: dir, stdio: "inherit", shell: process.platform === "win32" });

console.log(`\nProyecto de prueba en ${dir}\n`);

writeFileSync(
  join(dir, "package.json"),
  JSON.stringify({ name: "consumidor", private: true, type: "module" }, null, 2),
);

writeFileSync(
  join(dir, "index.html"),
  `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
);

writeFileSync(join(dir, "vite.config.ts"), `export default {};\n`);

mkdirSync(join(dir, "src"));
writeFileSync(
  join(dir, "src/main.tsx"),
  // Exactamente los dos imports documentados en el README.
  `import { createRoot } from "react-dom/client";
import { Button, Chip, TextField } from "@tikin/ui";
import "@tikin/ui/styles.css";

createRoot(document.getElementById("root")).render(
  <>
    <Button>Confirmar</Button>
    <Chip feedback="success">Listo</Chip>
    <TextField label="Correo" />
  </>,
);
`,
);

run("npm", ["install", "--no-audit", "--no-fund", ...tarballs, "react", "react-dom"]);
run("npm", ["install", "--no-audit", "--no-fund", "-D", "vite", "@vitejs/plugin-react", "typescript"]);

writeFileSync(
  join(dir, "vite.config.ts"),
  `import react from "@vitejs/plugin-react";\nexport default { plugins: [react()] };\n`,
);

run("npx", ["vite", "build"]);

console.log("\nLa libreria se instala y compila en un proyecto limpio.\n");
