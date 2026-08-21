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

try {
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
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

process.stdout.write(`Validator adversarial tests passed: ${cases.length} cases\n`);
