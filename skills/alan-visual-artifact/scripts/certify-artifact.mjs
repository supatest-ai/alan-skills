#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const artifactInput = args.shift();
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

if (!artifactInput) {
  process.stderr.write(
    "Usage: node scripts/certify-artifact.mjs <artifact.html> --profile <artifact|diagram|wireframe> [--browser-evidence evidence.json] [--output certificate.json]\n",
  );
  process.exit(2);
}

const profile = valueFor("--profile") ?? "artifact";
if (!new Set(["artifact", "diagram", "wireframe"]).has(profile)) {
  process.stderr.write(`Unsupported certification profile: ${profile}\n`);
  process.exit(2);
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const artifactPath = resolve(artifactInput);
const artifactBytes = await readFile(artifactPath);
const artifactSha256 = createHash("sha256").update(artifactBytes).digest("hex");
const validators = ["validate-artifact.mjs", "validate-theme.mjs"];
if (profile === "diagram") validators.push("validate-diagram.mjs", "validate-motion.mjs");
if (profile === "wireframe") validators.push("validate-wireframe.mjs");

const results = [];
let rejected = false;
for (const validator of validators) {
  const result = spawnSync(process.execPath, [resolve(scriptDirectory, validator), artifactPath], {
    encoding: "utf8",
  });
  const entry = {
    validator,
    status: result.status === 0 ? "pass" : "fail",
    output: (result.status === 0 ? result.stdout : result.stderr).trim(),
  };
  results.push(entry);
  if (result.status !== 0) rejected = true;
}

let browserEvidence = { status: "not-run", path: null, checks: null, captures: [] };
const browserEvidenceInput = valueFor("--browser-evidence");
if (browserEvidenceInput) {
  const evidencePath = resolve(browserEvidenceInput);
  try {
    const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
    const requiredChecks = ["wide", "narrow", "keyboard", "reducedMotion", "print", "overflow", "console"];
    const allowed = new Set(["pass", "fail", "not-applicable"]);
    const invalidChecks = requiredChecks.filter((check) => !allowed.has(evidence.checks?.[check]));
    const failedChecks = requiredChecks.filter((check) => evidence.checks?.[check] === "fail");
    const notApplicable = requiredChecks.filter((check) => evidence.checks?.[check] === "not-applicable");
    const notes = Array.isArray(evidence.notes) ? evidence.notes : [];
    const captures = Array.isArray(evidence.captures) ? evidence.captures : [];
    const evidenceFailures = [];
    if (evidence.artifactSha256 !== artifactSha256) evidenceFailures.push("artifact hash does not match");
    if (invalidChecks.length > 0) evidenceFailures.push(`invalid or missing checks: ${invalidChecks.join(", ")}`);
    if (failedChecks.length > 0) evidenceFailures.push(`failed checks: ${failedChecks.join(", ")}`);
    if (notApplicable.length > 0 && notes.length === 0) evidenceFailures.push("not-applicable checks require a note");
    if (notes.length === 0 || notes.some((note) => typeof note !== "string" || note.trim().length === 0)) {
      evidenceFailures.push("browser evidence requires non-empty visual inspection notes");
    }
    if (captures.length === 0) evidenceFailures.push("browser evidence has no inspected captures");
    for (const capture of captures) {
      if (typeof capture !== "string" || !/\.(?:png|jpe?g|webp)$/i.test(capture)) {
        evidenceFailures.push(`capture is not an image path: ${String(capture)}`);
        continue;
      }
      try {
        const capturePath = resolve(dirname(evidencePath), capture);
        const captureStat = await stat(capturePath);
        if (!captureStat.isFile() || captureStat.size < 32) {
          evidenceFailures.push(`capture is empty or truncated: ${capture}`);
          continue;
        }
        const header = (await readFile(capturePath)).subarray(0, 24);
        const extension = capture.toLowerCase().split(".").pop();
        const validPng =
          extension === "png" &&
          header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) &&
          header.readUInt32BE(16) > 0 &&
          header.readUInt32BE(20) > 0;
        const validJpeg =
          (extension === "jpg" || extension === "jpeg") && header[0] === 0xff && header[1] === 0xd8;
        const validWebp =
          extension === "webp" &&
          header.subarray(0, 4).toString("ascii") === "RIFF" &&
          header.subarray(8, 12).toString("ascii") === "WEBP";
        if (!validPng && !validJpeg && !validWebp) {
          evidenceFailures.push(`capture header does not match its image extension: ${capture}`);
        }
      } catch {
        evidenceFailures.push(`capture is missing: ${capture}`);
      }
    }
    browserEvidence = {
      status: evidenceFailures.length === 0 ? "pass" : "fail",
      path: evidencePath,
      checks: evidence.checks ?? null,
      captures,
      notes,
      failures: evidenceFailures,
    };
    if (evidenceFailures.length > 0) rejected = true;
  } catch (error) {
    browserEvidence = {
      status: "fail",
      path: evidencePath,
      checks: null,
      captures: [],
      failures: [error instanceof Error ? error.message : String(error)],
    };
    rejected = true;
  }
}

const certificate = {
  status: rejected ? "rejected" : "pass",
  level: rejected ? "rejected" : browserEvidence.status === "pass" ? "browser-backed" : "structural",
  profile,
  artifactPath,
  artifactSha256,
  structuralChecks: results,
  browserEvidence,
  visualSemanticJudgment: browserEvidence.status === "pass" ? "recorded-in-browser-evidence-notes" : "not-run",
};

const serialized = `${JSON.stringify(certificate, null, 2)}\n`;
const outputInput = valueFor("--output");
if (outputInput) await writeFile(resolve(outputInput), serialized, "utf8");
process.stdout.write(serialized);
if (rejected) process.exit(1);
