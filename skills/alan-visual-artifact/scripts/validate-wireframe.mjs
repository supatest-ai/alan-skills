#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2];
if (!input) {
  process.stderr.write("Usage: node scripts/validate-wireframe.mjs <artifact.html>\n");
  process.exit(2);
}

const artifactPath = resolve(input);
const html = await readFile(artifactPath, "utf8");
const failures = [];

if (!/data-artifact-profile=["']wireframe["']/i.test(html)) failures.push("missing wireframe profile marker");
if (/lorem ipsum|placeholder (?:text|copy)|example content/i.test(html)) failures.push("contains non-representative placeholder copy");
if (/linear-gradient|radial-gradient|conic-gradient|box-shadow\s*:/i.test(html)) failures.push("contains polished gradient or shadow styling");
if (/<img(?:\s|>)/i.test(html)) failures.push("uses an image instead of a labeled structural placeholder");
if (/@keyframes|\banimation\s*:|\btransition\s*:/i.test(html)) failures.push("wireframe contains production-like motion");

const directionMatches = [...html.matchAll(/<section\b[^>]*\sdata-direction=["']([^"']+)["'][^>]*>/gi)];
if (directionMatches.length < 1 || directionMatches.length > 3) {
  failures.push(`expected one to three directions, found ${directionMatches.length}`);
}

const directionIds = new Set(directionMatches.map((match) => match[1]));
if (directionMatches.length > 1) {
  if (!/role=["']tablist["']/i.test(html)) failures.push("multiple directions require a tablist selector");
  const tabs = [...html.matchAll(/<button\b[^>]*role=["']tab["'][^>]*>/gi)];
  if (tabs.length !== directionMatches.length) failures.push("tab count does not match direction count");
  for (const tab of tabs) {
    const target = tab[0].match(/aria-controls=["']([^"']+)["']/i)?.[1];
    if (!target || !directionIds.has(target)) failures.push("tab aria-controls does not target a direction");
    if (!/aria-selected=["'](?:true|false)["']/i.test(tab[0])) failures.push("tab missing aria-selected state");
  }
}

const requirementSets = new Map();
for (const match of html.matchAll(/<section\b[^>]*\sdata-direction=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi)) {
  requirementSets.set(match[1], new Set([...match[2].matchAll(/data-requirement=["']([^"']+)["']/gi)].map((entry) => entry[1])));
}
const baseline = [...requirementSets.values()][0];
if (!baseline || baseline.size < 3) failures.push("directions must declare at least three shared requirement markers");
for (const [direction, requirements] of requirementSets) {
  if (baseline && (requirements.size !== baseline.size || [...baseline].some((item) => !requirements.has(item)))) {
    failures.push(`direction ${direction} does not preserve the shared requirements`);
  }
}

if (directionMatches.length > 1) {
  if (!/classList\.add\(["']is-enhanced["']\)/.test(html)) failures.push("direction switching is not progressive enhancement");
  if (!/addEventListener\(["']click["']/.test(html)) failures.push("direction selector has no click behavior");
  if (!/addEventListener\(["']keydown["']/.test(html)) failures.push("direction selector has no keyboard behavior");
}

if (!/data-annotation/i.test(html)) failures.push("wireframe has no explicit assumption or open-question annotation");

if (failures.length > 0) {
  process.stderr.write(`Wireframe validation failed for ${artifactPath}:\n`);
  for (const failure of [...new Set(failures)]) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`Wireframe validation passed: ${artifactPath}\n`);
