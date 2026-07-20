import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // React y react-dom son peer deps: nunca deben acabar en el bundle, o el
  // consumidor terminaria con dos copias de React y hooks rotos.
  external: ["react", "react-dom"],
  outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".js" }),
});
