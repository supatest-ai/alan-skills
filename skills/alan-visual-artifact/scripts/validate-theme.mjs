#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2];
if (!input) {
  process.stderr.write("Usage: node scripts/validate-theme.mjs <artifact.html>\n");
  process.exit(2);
}

const artifactPath = resolve(input);
const html = await readFile(artifactPath, "utf8");
const failures = [];

const allowedHex = new Set(
  [
    "#f5f5f5",
    "#ffffff",
    "#ececec",
    "#2d3142",
    "#4f5d75",
    "#7a8399",
    "#bfc0c0",
    "#393e53",
    "#8e98ac",
    "#eb6c36",
    "#f08a59",
    "#5e7a9b",
    "#82a0c0",
    "#7c8f6f",
    "#9caf8f",
    "#b8915a",
    "#d3ad7a",
    "#9c6b50",
    "#b88670",
    "#6e6479",
    "#8d8298",
  ].map((value) => value.toLowerCase()),
);

const allowedAlphaRgb = new Set(["0,0,0", "45,49,66", "191,192,192", "235,108,54", "240,138,89", "245,245,245", "255,255,255"]);

if (!/<html\s+[^>]*data-artifact-theme=["']editorial["']/i.test(html)) {
  failures.push('missing data-artifact-theme="editorial"');
}
if (!/@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/i.test(html)) {
  failures.push("missing operating-system dark presentation state");
}
if (!/:root\[data-theme=["']dark["']\]/i.test(html)) {
  failures.push("missing explicit dark host override");
}
if (!/:root\[data-theme=["']light["']\]/i.test(html)) {
  failures.push("missing explicit light host override");
}
if (!/color-scheme\s*:\s*light\s+dark/i.test(html)) {
  failures.push("missing light/dark color-scheme declaration");
}

const colorBearingText = [
  ...(html.match(/<style(?:\s|>)[\s\S]*?<\/style>/gi) ?? []),
  ...(html.match(/\sstyle=["'][^"']*["']/gi) ?? []),
  ...(html.match(/\s(?:fill|stroke|color|stop-color|flood-color|lighting-color)=["'][^"']*["']/gi) ?? []),
].join("\n");

for (const match of colorBearingText.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
  const value = match[0].toLowerCase();
  if (!allowedHex.has(value)) failures.push(`unapproved color ${value}`);
}

for (const match of colorBearingText.matchAll(/rgba?\(\s*([^)]+)\)/gi)) {
  const parts = match[1].split(",").map((part) => part.trim());
  if (parts.length !== 4) {
    failures.push(`unapproved color function ${match[0]}`);
    continue;
  }
  const rgb = parts.slice(0, 3).join(",");
  const alpha = Number(parts[3]);
  if (!allowedAlphaRgb.has(rgb) || !Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    failures.push(`unapproved alpha color ${match[0]}`);
  }
}

const forbiddenPatterns = [
  ["gradient", /(?:linear|radial|conic|repeating-linear|repeating-radial)-gradient\s*\(/i],
  ["non-token color function", /(?:hsl|hsla|hwb|lab|lch|oklab|oklch|color)\s*\(/i],
  ["text shadow", /text-shadow\s*:/i],
  ["filter effect", /(?:filter\s*:|drop-shadow\s*\()/i],
  ["theme chooser", /(?:theme|palette|skin)[-_ ]?(?:toggle|picker|selector|chooser)/i],
];
for (const [name, pattern] of forbiddenPatterns) {
  if (pattern.test(colorBearingText)) failures.push(`contains ${name}`);
}

const colorKeywords = colorBearingText.match(/(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*(?:aqua|blue|cyan|fuchsia|gold|gray|green|grey|lime|magenta|maroon|navy|olive|orange|pink|purple|red|silver|teal|violet|white|yellow)\b/gi) ?? [];
if (colorKeywords.length > 0) {
  failures.push(`contains named colors: ${[...new Set(colorKeywords.map((value) => value.toLowerCase()))].join(", ")}`);
}

if (failures.length > 0) {
  process.stderr.write(`Theme validation failed for ${artifactPath}:\n`);
  for (const failure of [...new Set(failures)]) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`Theme validation passed: ${artifactPath}\n`);
