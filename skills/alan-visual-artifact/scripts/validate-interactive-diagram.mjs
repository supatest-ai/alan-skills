#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2];
if (!input) {
  process.stderr.write("Usage: node scripts/validate-interactive-diagram.mjs <artifact.html>\n");
  process.exit(2);
}
const artifactPath = resolve(input);
const html = await readFile(artifactPath, "utf8");
const failures = [];

if (!/data-artifact-profile=["']interactive-diagram["']/i.test(html)) failures.push("missing interactive-diagram profile marker");
const buttons = [...html.matchAll(/<button\b[^>]*\sdata-flow=["']([^"']+)["'][^>]*>/gi)];
if (buttons.length < 2 || buttons.length > 8) failures.push(`expected two to eight scenario controls, found ${buttons.length}`);
const flowIds = buttons.map((match) => match[1]);
if (new Set(flowIds).size !== flowIds.length) failures.push("scenario controls contain duplicate flow ids");
if (!flowIds.includes("all")) failures.push("scenario controls require an all flow");
const selectedCount = buttons.filter((match) => /aria-pressed=["']true["']/i.test(match[0])).length;
if (selectedCount !== 1) failures.push(`expected one selected scenario, found ${selectedCount}`);
for (const button of buttons) {
  if (!/\sdata-flow-nodes=["'][^"']+["']/i.test(button[0])) failures.push(`flow ${button[1]} has no node references`);
  if (!/\sdata-flow-edges=["'][^"']+["']/i.test(button[0])) failures.push(`flow ${button[1]} has no edge references`);
  if (!/aria-pressed=["'](?:true|false)["']/i.test(button[0])) failures.push(`flow ${button[1]} lacks aria-pressed state`);
}

const nodeTags = [...html.matchAll(/<g\b[^>]*\sdata-node-id=["']([^"']+)["'][^>]*>/gi)];
const nodeIds = new Set(nodeTags.map((match) => match[1]));
for (const node of nodeTags) {
  if (!/tabindex=["']0["']/i.test(node[0])) failures.push(`node ${node[1]} is not keyboard focusable`);
  if (!/role=["']button["']/i.test(node[0])) failures.push(`node ${node[1]} lacks button role`);
  if (!/aria-label=["'][^"']+["']/i.test(node[0])) failures.push(`node ${node[1]} lacks an accessible label`);
  if (!new RegExp(`data-node-copy=["']${node[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(html)) failures.push(`node ${node[1]} lacks external detail copy`);
}
const edgeIds = new Set([...html.matchAll(/\sdata-connector=["']([^"']+)["']/gi)].map((match) => match[1]));
for (const button of buttons) {
  const nodeRefs = button[0].match(/\sdata-flow-nodes=["']([^"']+)["']/i)?.[1].trim().split(/\s+/) ?? [];
  const edgeRefs = button[0].match(/\sdata-flow-edges=["']([^"']+)["']/i)?.[1].trim().split(/\s+/) ?? [];
  for (const ref of nodeRefs) if (!nodeIds.has(ref)) failures.push(`flow ${button[1]} references unknown node ${ref}`);
  for (const ref of edgeRefs) if (!edgeIds.has(ref)) failures.push(`flow ${button[1]} references unknown edge ${ref}`);
  if (!new RegExp(`data-flow-copy=["']${button[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(html)) failures.push(`flow ${button[1]} lacks external explanation copy`);
}

if (!/data-flow-panel/i.test(html)) failures.push("missing external flow explanation panel");
if (!/data-node-panel/i.test(html)) failures.push("missing external node detail panel");
if (!/event\.key\s*===\s*["']Enter["'][\s\S]*?event\.key\s*===\s*["'] ["']/i.test(html)) failures.push("node activation lacks Enter and Space support");
if (!/addEventListener\(["']click["']/i.test(html)) failures.push("interactive diagram has no click behavior");
if (!/\.textContent\s*=/i.test(html)) failures.push("interactive updates do not use safe textContent");
if (/\.innerHTML\s*=/i.test(html)) failures.push("interactive diagram uses markup injection");
if (!/min-width\s*:\s*(?:8|9|1\d)\d{2}px/i.test(html) || !/overflow-x\s*:\s*auto/i.test(html)) failures.push("dense diagram lacks a contained legible-width scroller");
if (!/@media\s+(?:\(\s*)?print[\s\S]*?data-flow-copy[^}]*display\s*:\s*block/i.test(html)) failures.push("print does not expose every flow explanation");

if (failures.length > 0) {
  process.stderr.write(`Interactive diagram validation failed for ${artifactPath}:\n`);
  for (const failure of [...new Set(failures)]) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}
process.stdout.write(`Interactive diagram validation passed: ${artifactPath}\n`);
