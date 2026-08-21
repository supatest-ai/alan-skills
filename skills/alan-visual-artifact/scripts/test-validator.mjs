#!/usr/bin/env node

import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const skillDirectory = resolve(scriptDirectory, "..");
const validatorPath = resolve(scriptDirectory, "validate-artifact.mjs");
const fixturePath = process.argv[2] ?? resolve(skillDirectory, "examples/generated/demo.html");
const validArtifact = await readFile(fixturePath, "utf8");
const wireframeFixturePath = process.argv[3];
const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "alan-artifact-validator-"));

const cases = [
  {
    name: "external script",
    mutate: (html) =>
      html.replace(
        "</head>",
        `<script src="${"ht" + "tps" + "://invalid.example/remote.js"}"></script></head>`,
      ),
  },
  {
    name: "network API",
    mutate: (html) => html.replace("</script>", 'fetch("/private")</script>'),
  },
  {
    name: "browser storage",
    mutate: (html) => html.replace("</script>", 'localStorage.setItem("x", "y")</script>'),
  },
  {
    name: "markup injection",
    mutate: (html) => html.replace("</script>", 'document.body.innerHTML = "x"</script>'),
  },
  {
    name: "missing SVG description",
    mutate: (html) => html.replace(/<desc[^>]*>[\s\S]*?<\/desc>/i, ""),
  },
  {
    name: "unresolved placeholder",
    mutate: (html) => html.replace("</main>", "{{MISSING}}</main>"),
  },
  {
    name: "form capability",
    mutate: (html) => html.replace("</main>", "<form><button>Send</button></form></main>"),
  },
];

for (const [index, testCase] of cases.entries()) {
  const fixturePath = resolve(temporaryDirectory, `invalid-${index}.html`);
  await writeFile(fixturePath, testCase.mutate(validArtifact), "utf8");
  const result = spawnSync(process.execPath, [validatorPath, fixturePath], {
    encoding: "utf8",
  });
  if (result.status === 0) {
    throw new Error(`Validator accepted forbidden case: ${testCase.name}`);
  }
  process.stdout.write(`Rejected: ${testCase.name}\n`);
}

process.stdout.write(`Validator adversarial tests passed: ${cases.length} cases\n`);

const profileCases = [
  {
    name: "off-palette color",
    validator: "validate-theme.mjs",
    html: validArtifact.replace("#f5f5f5", "#7f00ff"),
  },
  {
    name: "gradient treatment",
    validator: "validate-theme.mjs",
    html: validArtifact.replace("background: var(--background);", "background: linear-gradient(#f5f5f5, #eb6c36);"),
  },
  {
    name: "missing explicit dark state",
    validator: "validate-theme.mjs",
    html: validArtifact.replace(':root[data-theme="dark"]', ':root[data-theme="night"]'),
  },
  {
    name: "missing node geometry",
    validator: "validate-diagram.mjs",
    html: validArtifact.replace(/\sdata-node-box=["'][^"']+["']/i, ""),
  },
  {
    name: "overlapping node geometry",
    validator: "validate-diagram.mjs",
    html: validArtifact.replace('data-node-box="305 48 220 68"', 'data-node-box="40 48 220 68"'),
  },
  {
    name: "unlabeled connector",
    validator: "validate-diagram.mjs",
    html: validArtifact.replace(/<text\b[^>]*data-connector-label=["']evidence["'][\s\S]*?<\/text>/i, ""),
  },
  {
    name: "unscoped infinite motion",
    validator: "validate-motion.mjs",
    html: validArtifact.replace('[data-motion="flow-hint"] {', ".unscoped-motion {"),
  },
];

if (wireframeFixturePath) {
  const wireframe = await readFile(wireframeFixturePath, "utf8");
  profileCases.push(
    {
      name: "wireframe polish drift",
      validator: "validate-wireframe.mjs",
      html: wireframe.replace("body {", "body { box-shadow: 0 1px 2px #000;"),
    },
    {
      name: "wireframe requirement drift",
      validator: "validate-wireframe.mjs",
      html: wireframe.replace('data-requirement="decision"', 'data-requirement="different"'),
    },
    {
      name: "wireframe broken selector",
      validator: "validate-wireframe.mjs",
      html: wireframe.replace('aria-controls="overview-first"', 'aria-controls="missing"'),
    },
  );
}

try {
  for (const [index, testCase] of profileCases.entries()) {
    const invalidPath = resolve(temporaryDirectory, `profile-invalid-${index}.html`);
    await writeFile(invalidPath, testCase.html, "utf8");
    const result = spawnSync(process.execPath, [resolve(scriptDirectory, testCase.validator), invalidPath], {
      encoding: "utf8",
    });
    if (result.status === 0) throw new Error(`Validator accepted forbidden case: ${testCase.name}`);
    process.stdout.write(`Rejected: ${testCase.name}\n`);
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

process.stdout.write(`Profile validator adversarial tests passed: ${profileCases.length} cases\n`);
