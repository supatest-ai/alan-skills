#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const skillDirectory = resolve(scriptDirectory, "..");
const templatePath = resolve(skillDirectory, "templates/artifact.html");
const dataPath = resolve(skillDirectory, "examples/demo-data.json");
const outputPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(skillDirectory, "examples/generated/demo.html");

const [template, rawData] = await Promise.all([
  readFile(templatePath, "utf8"),
  readFile(dataPath, "utf8"),
]);
const data = JSON.parse(rawData);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const rendered = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (placeholder, key) => {
  if (!(key in data)) {
    throw new Error(`Missing demo value for ${placeholder}`);
  }
  return escapeHtml(data[key]);
});

const unresolved = rendered.match(/\{\{[A-Z0-9_]+\}\}/g);
if (unresolved) {
  throw new Error(`Unresolved placeholders: ${unresolved.join(", ")}`);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, rendered, "utf8");
process.stdout.write(`${outputPath}\n`);
