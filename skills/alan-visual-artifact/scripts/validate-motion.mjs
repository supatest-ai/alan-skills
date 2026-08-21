#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2];
if (!input) {
  process.stderr.write("Usage: node scripts/validate-motion.mjs <artifact.html>\n");
  process.exit(2);
}

const artifactPath = resolve(input);
const html = await readFile(artifactPath, "utf8");
const failures = [];
const hasMotion = /@keyframes|\banimation\s*:|\bsetInterval\s*\(/i.test(html);

if (hasMotion) {
  if (!/prefers-reduced-motion\s*:\s*reduce/i.test(html)) failures.push("missing reduced-motion contract");
  if (!/@media\s+(?:\(\s*)?print[\s\S]*?data-motion|@media\s+(?:\(\s*)?print[\s\S]*?flow-trace/i.test(html)) {
    failures.push("print rules do not suppress motion");
  }
  if (!/visibilitychange/i.test(html) || !/document\.hidden/i.test(html)) {
    failures.push("scripted motion does not stop when the document is hidden");
  }
  if (!/classList\.add\(["']is-enhanced["']\)/.test(html)) failures.push("motion is not enhancement-scoped");
}

for (const rule of html.matchAll(/([^{}]+)\{([^{}]*\banimation\s*:[^{}]*\binfinite\b[^{}]*)\}/gi)) {
  if (!/\[data-motion=["']flow-hint["']\]/.test(rule[1])) {
    failures.push(`infinite motion is not scoped to data-motion=flow-hint: ${rule[1].trim()}`);
  }
}

for (const keyframes of html.matchAll(/@keyframes\s+[\w-]+\s*\{([\s\S]*?)\}\s*\}/gi)) {
  if (/\b(?:width|height|top|right|bottom|left|margin|padding)\s*:/i.test(keyframes[1])) {
    failures.push("keyframes animate layout properties");
  }
}

if (/data-step/i.test(html)) {
  for (const action of ["previous", "next", "play", "replay"]) {
    if (!new RegExp(`data-action=["']${action}["']`, "i").test(html)) failures.push(`missing ${action} control`);
  }
  if (!/aria-live=["']polite["']/i.test(html)) failures.push("stepped motion missing polite live region");
  if (!/clearInterval\s*\(/.test(html)) failures.push("stepped motion has no timer stop path");
}

if (failures.length > 0) {
  process.stderr.write(`Motion validation failed for ${artifactPath}:\n`);
  for (const failure of [...new Set(failures)]) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`Motion validation passed: ${artifactPath}\n`);
