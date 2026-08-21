#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const input = process.argv[2];
if (!input) {
  process.stderr.write("Usage: node scripts/validate-artifact.mjs <artifact.html>\n");
  process.exit(2);
}

const artifactPath = resolve(input);
const html = await readFile(artifactPath, "utf8");
const failures = [];

function requirePattern(name, pattern) {
  if (!pattern.test(html)) failures.push(`missing ${name}`);
}

function rejectPattern(name, pattern) {
  if (pattern.test(html)) failures.push(`contains ${name}`);
}

requirePattern("doctype", /<!doctype html>/i);
requirePattern("document language", /<html\s+[^>]*lang=["'][^"']+["']/i);
requirePattern("viewport metadata", /<meta\s+[^>]*name=["']viewport["']/i);
requirePattern("non-empty title", /<title>\s*[^<{][^<]*<\/title>/i);
requirePattern("main landmark", /<main(?:\s|>)/i);
const primaryHeadingCount = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
if (primaryHeadingCount !== 1) {
  failures.push(`expected one primary heading, found ${primaryHeadingCount}`);
}
requirePattern("print behavior", /@media\s+(?:\(\s*)?print(?:\s*\))?/i);
requirePattern("reduced motion behavior", /prefers-reduced-motion\s*:\s*reduce/i);
requirePattern("narrow-width behavior", /@media\s*\(\s*max-width\s*:/i);
requirePattern("focus-visible styling", /:focus-visible/i);

const svgBlocks = html.match(/<svg(?:\s|>)[\s\S]*?<\/svg>/gi) ?? [];
for (const [index, svg] of svgBlocks.entries()) {
  if (!/<svg\s+[^>]*role=["']img["']/i.test(svg)) {
    failures.push(`SVG ${index + 1} missing accessible role`);
  }
  if (!/<title(?:\s|>)[\s\S]*?<\/title>/i.test(svg)) {
    failures.push(`SVG ${index + 1} missing title`);
  }
  if (!/<desc(?:\s|>)[\s\S]*?<\/desc>/i.test(svg)) {
    failures.push(`SVG ${index + 1} missing description`);
  }
}

const scriptCount = (html.match(/<script(?:\s|>)/gi) ?? []).length;
if (scriptCount > 0) {
  requirePattern("live-region announcement", /aria-live=["']polite["']/i);
  requirePattern("static-first enhancement", /classList\.add\(["']is-enhanced["']\)/);
}

rejectPattern("unresolved template placeholders", /\{\{[A-Z0-9_]+\}\}/);
rejectPattern("external or protocol-relative resource", /(?:src|href)\s*=\s*["'](?:https?:|\/\/)/i);
rejectPattern("external responsive image resource", /srcset\s*=\s*["'][^"']*(?:https?:|\/\/)/i);
rejectPattern("external stylesheet", /<link\s+[^>]*rel=["']stylesheet["']/i);
rejectPattern("CSS import", /@import\s+(?:url\s*\()?\s*["']?(?:https?:|\/\/)/i);
rejectPattern("external CSS resource", /url\s*\(\s*["']?(?:https?:|\/\/)/i);
rejectPattern("embedded remote-capable element", /<(?:iframe|object|embed|video|audio)(?:\s|>)/i);
rejectPattern("SVG foreign content", /<foreignObject(?:\s|>)/i);
rejectPattern("base URL override", /<base(?:\s|>)/i);
rejectPattern("metadata redirect", /<meta\s+[^>]*http-equiv=["']refresh["']/i);
rejectPattern("form", /<form(?:\s|>)/i);
rejectPattern("network API", /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/);
rejectPattern("browser persistence", /\b(?:localStorage|sessionStorage|indexedDB|serviceWorker|caches)\b/);
rejectPattern("dynamic evaluation", /\b(?:eval|Function)\s*\(/);
rejectPattern("worker execution", /\b(?:Worker|SharedWorker)\s*\(/);
rejectPattern("markup injection", /\.(?:innerHTML|outerHTML)\s*=/);
rejectPattern("popup", /\bwindow\.open\s*\(/);
rejectPattern("parent navigation", /\b(?:parent|top)\.location\b/);
rejectPattern("script URL", /(?:src|href)\s*=\s*["']\s*(?:javascript:|data:text\/html)/i);
rejectPattern("download capability", /\sdownload(?:\s|=|>)/i);
rejectPattern("legacy CSS execution", /(?:expression\s*\(|[;{]\s*behavior\s*:)/i);
rejectPattern("inline event handler", /\son[a-z]+\s*=/i);

if (failures.length > 0) {
  process.stderr.write(`Artifact validation failed for ${artifactPath}:\n`);
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`Artifact validation passed: ${artifactPath}\n`);
