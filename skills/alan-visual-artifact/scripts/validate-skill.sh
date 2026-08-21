#!/usr/bin/env bash
set -euo pipefail

skill_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
repo_root="$(cd "$skill_root/../.." && pwd)"

printf '%s\n' "Validating alan-visual-artifact"

if ! awk '
  /^---$/ { frontmatter += 1; next }
  frontmatter == 1 && /^name:[[:space:]]+alan-visual-artifact[[:space:]]*$/ { name = 1 }
  frontmatter == 1 && /^description:[[:space:]]+[^[:space:]]/ { description = 1 }
  END { exit !(frontmatter >= 2 && name && description) }
' "$skill_root/SKILL.md"; then
  printf '%s\n' "SKILL.md is missing valid name or description frontmatter" >&2
  exit 1
fi

visual_skill_count="$({
  find "$repo_root/skills" -mindepth 2 -maxdepth 2 -name SKILL.md -print0 \
    | xargs -0 awk '/^name:[[:space:]]+alan-visual/{ print FILENAME }'
} | sort -u | wc -l | tr -d ' ')"
if [[ "$visual_skill_count" != "1" ]]; then
  printf '%s\n' "Expected one alan-visual* runtime skill, found $visual_skill_count" >&2
  exit 1
fi

for required_file in \
  references/routing.md \
  references/diagram-catalog.md \
  references/composition.md \
  references/rendering.md \
  templates/artifact.html \
  examples/demo-data.json \
  examples/design-graph.md \
  examples/evals.md \
  scripts/render-demo.mjs \
  scripts/validate-artifact.mjs \
  scripts/test-validator.mjs; do
  if [[ ! -f "$skill_root/$required_file" ]]; then
    printf '%s\n' "Missing required skill-pack file: $required_file" >&2
    exit 1
  fi
done

printf '%s\n' "Checking one-pack identity and offline runtime"
if rg -n -i 'palantir|plannotator|effective[- ]html|diagram-design|guides\.show|cathryn|blueprint' "$skill_root" \
  --glob '!**/validate-skill.sh'; then
  printf '%s\n' "Runtime pack contains an evaluated product or author identity" >&2
  exit 1
fi

if find "$skill_root" -type f \( -name 'openai.yaml' -o -name 'plugin.json' -o -name 'marketplace.json' \) -print -quit | grep -q .; then
  printf '%s\n' "Runtime pack contains provider or plugin packaging" >&2
  exit 1
fi

if rg -n -i '(https?:)?//|npx skills|curl .*(upload|share|publish)|guides\.show' \
  "$skill_root/templates" "$skill_root/scripts/render-demo.mjs"; then
  printf '%s\n' "Template or renderer contains an external dependency or publication path" >&2
  exit 1
fi

diagram_count="$(awk -F '|' '
  /^## Canonical diagram routing$/ { routes = 1; next }
  /^## Selection rules$/ { routes = 0 }
  routes && /^\| [^ -]/ && $3 !~ /Diagram/ { count += 1 }
  END { print count + 0 }
' "$skill_root/references/routing.md")"
if [[ "$diagram_count" != "40" ]]; then
  printf '%s\n' "Expected 39 diagram families plus wireframe, found $diagram_count routes" >&2
  exit 1
fi

temporary_directory="$(mktemp -d "${TMPDIR:-/tmp}/alan-visual-artifact.XXXXXX")"
trap 'rm -rf "$temporary_directory"' EXIT
demo_path="$temporary_directory/demo.html"

printf '%s\n' "Rendering and validating the self-contained fixture"
node "$skill_root/scripts/render-demo.mjs" "$demo_path" >/dev/null
node "$skill_root/scripts/validate-artifact.mjs" "$demo_path"
node "$skill_root/scripts/test-validator.mjs" "$demo_path"

printf '%s\n' "Checking scripts and JSON fixtures"
bash -n "$skill_root/scripts/validate-skill.sh"
node --check "$skill_root/scripts/render-demo.mjs"
node --check "$skill_root/scripts/validate-artifact.mjs"
node --check "$skill_root/scripts/test-validator.mjs"
node -e 'JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8"))' "$skill_root/examples/demo-data.json"

printf '%s\n' "alan-visual-artifact validation complete"
