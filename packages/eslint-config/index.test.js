import test from "node:test";
import assert from "node:assert/strict";
import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import config, { recommended, strict } from "./index.js";

const linter = new Linter();

// El consumidor ya parsea tsx; aquí lo montamos a mano para poder verificar
// código suelto con la API de ESLint.
const parserBlock = {
  files: ["**/*.tsx"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
  },
};

function lint(code, cfg = recommended) {
  return linter.verify(code, [parserBlock, ...cfg], { filename: "Comp.tsx" });
}

function restricted(msgs) {
  return msgs.filter((m) => m.ruleId === "no-restricted-syntax");
}

test("marca <button> crudo como error y sugiere Button", () => {
  const msgs = restricted(lint(`export const A = () => <button>Hola</button>;`));
  assert.equal(msgs.length, 1);
  assert.equal(msgs[0].severity, 2);
  assert.match(msgs[0].message, /Button/);
});

test("marca <input> y <textarea>", () => {
  assert.equal(restricted(lint(`export const A = () => <input />;`)).length, 1);
  assert.equal(restricted(lint(`export const A = () => <textarea />;`)).length, 1);
});

test("no marca componentes del DS (nombre capitalizado)", () => {
  const code = `import { Button } from "@tikin/ui"; export const A = () => <Button>Hola</Button>;`;
  assert.equal(restricted(lint(code)).length, 0);
});

test("el default es recommended: no marca <table>", () => {
  assert.equal(restricted(lint(`export const A = () => <table />;`, config)).length, 0);
});

test("strict sí marca <table>", () => {
  assert.equal(restricted(lint(`export const A = () => <table />;`, strict)).length, 1);
});

test("permite el escape con eslint-disable-next-line", () => {
  const code = `export const A = () => (
    // eslint-disable-next-line no-restricted-syntax
    <button>ok</button>
  );`;
  assert.equal(restricted(lint(code)).length, 0);
});
