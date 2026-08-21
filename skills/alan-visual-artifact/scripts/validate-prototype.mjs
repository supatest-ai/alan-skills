#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2];
if (!input) {
  process.stderr.write("Usage: node scripts/validate-prototype.mjs <artifact.html>\n");
  process.exit(2);
}
const artifactPath = resolve(input);
const html = await readFile(artifactPath, "utf8");
const failures = [];
if (!/data-artifact-profile=["']prototype["']/i.test(html)) failures.push("missing prototype profile marker");
if (!/data-simulation-boundary/i.test(html) || !/simulated boundary/i.test(html)) failures.push("missing visible simulated boundary");
for (const exclusion of ["backend", "persistence", "production"]) {
  if (!new RegExp(exclusion, "i").test(html)) failures.push(`simulation boundary does not name ${exclusion}`);
}
const states = [...html.matchAll(/<article\b[^>]*\sdata-prototype-state=["']([^"']+)["'][^>]*\sdata-state-kind=["']([^"']+)["'][^>]*>/gi)];
const stateIds = new Set(states.map((match) => match[1]));
const stateKinds = new Set(states.map((match) => match[2]));
if (states.length < 4 || states.length > 7) failures.push(`expected four to seven bounded states, found ${states.length}`);
for (const kind of ["initial", "loading", "success", "error"]) if (!stateKinds.has(kind)) failures.push(`missing ${kind} state kind`);
const actions = [...html.matchAll(/<button\b[^>]*\sdata-prototype-action=["']([^"']+)["'][^>]*\sdata-target-state=["']([^"']+)["'][^>]*>/gi)];
if (actions.length === 0) failures.push("prototype has no deterministic transition controls");
for (const action of actions) if (!stateIds.has(action[2])) failures.push(`action ${action[1]} targets unknown state ${action[2]}`);
if (!actions.some((action) => /data-recovery-action/i.test(action[0]))) failures.push("prototype has no explicit recovery action");
if (!/data-transition-map/i.test(html)) failures.push("prototype lacks a static transition map");
if (!/classList\.add\(["']is-enhanced["']\)/.test(html)) failures.push("prototype is not progressive enhancement");
if (!/addEventListener\(["']click["']/.test(html)) failures.push("prototype controls have no click behavior");
if (!/\.textContent\s*=/.test(html)) failures.push("prototype does not announce state with safe textContent");
if (!/@media\s+(?:\(\s*)?print[\s\S]*?data-prototype-state[^}]*display\s*:\s*grid/i.test(html)) failures.push("print does not expose every prototype state");
if (/\bsetTimeout\s*\(|\bsetInterval\s*\(/.test(html)) failures.push("prototype uses time-based fake behavior");

if (failures.length > 0) {
  process.stderr.write(`Prototype validation failed for ${artifactPath}:\n`);
  for (const failure of [...new Set(failures)]) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}
process.stdout.write(`Prototype validation passed: ${artifactPath}\n`);
