#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const diagramPath = process.argv[2];
const wireframePath = process.argv[3];
if (!diagramPath || !wireframePath) {
  process.stderr.write("Usage: node scripts/test-certifier.mjs <diagram.html> <wireframe.html>\n");
  process.exit(2);
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const certifierPath = resolve(scriptDirectory, "certify-artifact.mjs");
const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "alan-certifier-tests-"));

function run(args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [certifierPath, ...args], { encoding: "utf8" });
  if (result.status !== expectedStatus) {
    throw new Error(`Unexpected certifier status ${result.status}: ${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout);
}

const structuralDiagram = run([diagramPath, "--profile", "diagram"]);
if (structuralDiagram.level !== "structural") throw new Error("Diagram did not receive structural certificate");

const structuralWireframe = run([wireframePath, "--profile", "wireframe"]);
if (structuralWireframe.level !== "structural") throw new Error("Wireframe did not receive structural certificate");

const artifactSha256 = createHash("sha256").update(await readFile(diagramPath)).digest("hex");
const capturePath = resolve(temporaryDirectory, "wide.png");
const captureFixture = Buffer.alloc(64);
Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(captureFixture, 0);
captureFixture.writeUInt32BE(1, 16);
captureFixture.writeUInt32BE(1, 20);
await writeFile(capturePath, captureFixture);
const evidencePath = resolve(temporaryDirectory, "browser-evidence.json");
const passingEvidence = {
  artifactSha256,
  checks: {
    wide: "pass",
    narrow: "pass",
    keyboard: "pass",
    reducedMotion: "pass",
    print: "pass",
    overflow: "pass",
    console: "pass",
  },
  captures: ["wide.png"],
  notes: ["Test harness verifies browser-evidence manifest acceptance."],
};
await writeFile(evidencePath, JSON.stringify(passingEvidence), "utf8");

const browserBacked = run([
  diagramPath,
  "--profile",
  "diagram",
  "--browser-evidence",
  evidencePath,
]);
if (browserBacked.level !== "browser-backed") throw new Error("Matching browser evidence was not accepted");

await writeFile(evidencePath, JSON.stringify({ ...passingEvidence, notes: [] }), "utf8");
const missingJudgment = run([
  diagramPath,
  "--profile",
  "diagram",
  "--browser-evidence",
  evidencePath,
], 1);
if (missingJudgment.status !== "rejected") throw new Error("Missing visual inspection notes were not rejected");

await writeFile(capturePath, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
await writeFile(evidencePath, JSON.stringify(passingEvidence), "utf8");
const truncatedCapture = run([
  diagramPath,
  "--profile",
  "diagram",
  "--browser-evidence",
  evidencePath,
], 1);
if (truncatedCapture.status !== "rejected") throw new Error("Truncated browser capture was not rejected");

await writeFile(capturePath, captureFixture);
await writeFile(evidencePath, JSON.stringify({ ...passingEvidence, artifactSha256: "0".repeat(64) }), "utf8");
const rejected = run([
  diagramPath,
  "--profile",
  "diagram",
  "--browser-evidence",
  evidencePath,
], 1);
if (rejected.status !== "rejected") throw new Error("Mismatched browser evidence was not rejected");

process.stdout.write(
  "Certification tests passed: structural, wireframe, browser-backed, missing-notes, truncated-capture, stale-evidence rejection\n",
);
