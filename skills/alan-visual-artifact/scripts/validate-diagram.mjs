#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2];
if (!input) {
  process.stderr.write("Usage: node scripts/validate-diagram.mjs <artifact.html>\n");
  process.exit(2);
}

const artifactPath = resolve(input);
const html = await readFile(artifactPath, "utf8");
const failures = [];
const svgBlocks = html.match(/<svg(?:\s|>)[\s\S]*?<\/svg>/gi) ?? [];

if (svgBlocks.length === 0) failures.push("diagram profile requires at least one SVG");

const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) failures.push(`duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);

const knownIds = new Set(ids);
for (const match of html.matchAll(/(?:url\(#|(?:href|aria-labelledby)=["']#?)([A-Za-z][\w:.-]*)/gi)) {
  if (!knownIds.has(match[1])) failures.push(`unresolved reference: ${match[1]}`);
}

for (const [svgIndex, svg] of svgBlocks.entries()) {
  const viewBoxMatch = svg.match(/\sviewBox=["']\s*(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (!viewBoxMatch) {
    failures.push(`SVG ${svgIndex + 1} missing numeric viewBox`);
    continue;
  }
  const viewBox = viewBoxMatch.slice(1).map(Number);
  const [minX, minY, width, height] = viewBox;
  if (!(width > 0 && height > 0)) failures.push(`SVG ${svgIndex + 1} has invalid viewBox size`);

  const nodeBoxes = [...svg.matchAll(/\sdata-node-box=["']([^"']+)["']/gi)].map((match) =>
    match[1].trim().split(/\s+/).map(Number),
  );
  const nodeGroups = svg.match(/<g\b[^>]*\bclass=["'][^"']*\bnode\b[^"']*["'][^>]*>/gi) ?? [];
  if (nodeBoxes.length === 0) failures.push(`SVG ${svgIndex + 1} has no declared node boxes`);
  if (nodeGroups.length !== nodeBoxes.length) {
    failures.push(`SVG ${svgIndex + 1} has ${nodeGroups.length} nodes but ${nodeBoxes.length} declared node boxes`);
  }
  if (nodeBoxes.length > 24) failures.push(`SVG ${svgIndex + 1} exceeds 24 declared nodes`);

  for (const [nodeIndex, box] of nodeBoxes.entries()) {
    if (box.length !== 4 || box.some((value) => !Number.isFinite(value))) {
      failures.push(`SVG ${svgIndex + 1} node ${nodeIndex + 1} has invalid data-node-box`);
      continue;
    }
    const [x, y, boxWidth, boxHeight] = box;
    if (boxWidth <= 0 || boxHeight <= 0) {
      failures.push(`SVG ${svgIndex + 1} node ${nodeIndex + 1} has non-positive size`);
    }
    if (x < minX || y < minY || x + boxWidth > minX + width || y + boxHeight > minY + height) {
      failures.push(`SVG ${svgIndex + 1} node ${nodeIndex + 1} escapes the viewBox`);
    }
  }

  for (let left = 0; left < nodeBoxes.length; left += 1) {
    for (let right = left + 1; right < nodeBoxes.length; right += 1) {
      const [ax, ay, aw, ah] = nodeBoxes[left];
      const [bx, by, bw, bh] = nodeBoxes[right];
      const overlapX = Math.min(ax + aw, bx + bw) - Math.max(ax, bx);
      const overlapY = Math.min(ay + ah, by + bh) - Math.max(ay, by);
      if (overlapX > 1 && overlapY > 1) {
        failures.push(`SVG ${svgIndex + 1} nodes ${left + 1} and ${right + 1} overlap`);
      }
    }
  }

  const connectors = [...svg.matchAll(/<(?:path|line|polyline)\b[^>]*\sdata-connector=["']([^"']+)["'][^>]*>/gi)];
  const labels = new Set(
    [...svg.matchAll(/<text\b[^>]*\sdata-connector-label=["']([^"']+)["'][^>]*>[\s\S]*?<\/text>/gi)]
      .filter((match) => match[0].replace(/<[^>]+>/g, "").trim().length > 0)
      .map((match) => match[1]),
  );
  for (const connector of connectors) {
    const tag = connector[0];
    const id = connector[1];
    if (!/\sdata-label=["'][^"']+["']/i.test(tag)) failures.push(`connector ${id} missing data-label`);
    if (!/\smarker-end=["']url\(#[^)]+\)["']/i.test(tag)) failures.push(`connector ${id} missing marker-end`);
    if (!labels.has(id)) failures.push(`connector ${id} missing visible connector label`);
  }
  if (connectors.length === 0 && nodeBoxes.length > 1) {
    failures.push(`SVG ${svgIndex + 1} has multiple nodes but no declared connectors`);
  }
}

if (failures.length > 0) {
  process.stderr.write(`Diagram validation failed for ${artifactPath}:\n`);
  for (const failure of [...new Set(failures)]) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`Diagram validation passed: ${artifactPath}\n`);
