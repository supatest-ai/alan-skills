#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const skillDirectory = resolve(scriptDirectory, "..");
const outputPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(skillDirectory, "examples/generated/interactive-diagram.html");
const [template, source] = await Promise.all([
  readFile(resolve(skillDirectory, "templates/interactive-diagram.html"), "utf8"),
  readFile(resolve(skillDirectory, "examples/interactive-diagram-data.json"), "utf8"),
]);
const data = JSON.parse(source);
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const rendered = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (placeholder, key) => {
  if (!(key in data)) throw new Error(`Missing interactive diagram value for ${placeholder}`);
  return escapeHtml(data[key]);
});
if (/\{\{[A-Z0-9_]+\}\}/.test(rendered)) throw new Error("Interactive diagram contains unresolved placeholders");
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, rendered, "utf8");
process.stdout.write(`${outputPath}\n`);
