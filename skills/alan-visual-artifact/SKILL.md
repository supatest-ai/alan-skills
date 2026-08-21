---
name: alan-visual-artifact
description: "This skill should be used when an existing Alan workflow must \"create a rich visual plan\", \"render an interactive HTML artifact\", \"choose the right diagram\", or \"visualize a decision or report\". Do not use for ordinary prose responses, decorative charts, full product UI implementation, or external artifact publishing."
version: 1.2.0
---

# Alan Visual Artifact

Turn verified planning, decision, implementation, review, and test evidence into the smallest useful Alan-native artifact. Choose prose, a table, a diagram, a bounded wireframe, or self-contained interactive HTML according to the reader's question. Preserve the owning workflow's permissions, provenance, and persistence path.

This is an internal primitive. Existing workflows invoke it at their composition boundary; it does not replace planning, testing, review, task execution, or artifact storage.

It is one skill pack. Diagram selection, diagram construction, plan/report composition, bounded wireframes, interactive HTML, templates, and validators live beneath this single `SKILL.md`; do not split them into sibling skills.

## When Not to Use

- Do not add a visual when prose or a compact table answers the question more clearly.
- Do not create a decorative progress chart, pass/fail donut, invented metric, or diagram without grounded relationships.
- Do not use this primitive to implement a production interface. A wireframe may compare unresolved information architecture, navigation, or task flow only.
- Do not upload, share, publish, or fetch rendering dependencies from an external service. The owning Alan workflow persists the result through its existing website and artifact APIs.
- Do not ask the user to choose a theme. Apply the fixed editorial artifact presentation contract automatically.
- Do not silently repair missing evidence by inventing nodes, fields, owners, dates, cardinality, status, or coverage.

## Inputs

Obtain these values from the parent workflow or derive them from its verified context:

1. `context`: plan, decision, report, test report, change orientation, or UI-structure decision.
2. `audience`: the reader who must understand or decide.
3. `question`: one sentence describing what the artifact must make clear.
4. `evidence`: verified facts, relationships, values, source paths, revisions, and unresolved items.
5. `output`: the formats and persistence tools the parent workflow supports.
6. `constraints`: security, accessibility, export, width, print, or reduced-motion requirements.

If the parent does not supply an audience or question, infer them from the request and record the inference. If the evidence is insufficient for the requested visual, produce a bounded text/table result and name the missing evidence.

## Procedure

### 1. Preserve parent ownership

Keep the parent workflow authoritative for research, approval, persistence, and lifecycle state.

- Planning remains owned by the planning workflow.
- Implementation and PR state remain owned by the task-to-PR workflow.
- Test evidence remains owned by the testing workflow.
- Review findings remain owned by the review workflow.
- Artifact storage and website presentation remain owned by Alan's existing artifact capability.

Return presentation content and validation results to the parent. Do not introduce a second task, plan, review, publication, or storage protocol.

### 2. Build an evidence ledger

List every semantic claim that may appear in the artifact and link it to evidence. Separate:

- observed fact;
- interpretation;
- recommendation;
- unresolved assumption.

Reject any node, connector, state, label, number, status, or relationship without a supporting ledger entry. Preserve the source revision when the artifact describes code or another changing input.

### 3. Select the minimum useful form

Read [references/routing.md](references/routing.md). Start with this order:

1. prose;
2. table;
3. one static diagram;
4. one bounded wireframe;
5. self-contained interactive HTML.

Escalate only when the next form materially reduces ambiguity or supports a decision. Return `no visual` when prose or a table wins.

For a diagram, choose one dominant information axis and one canonical type. If two axes are both essential, use an overview plus a focused detail rather than merging grammars.

After choosing a diagram, read [references/diagram-catalog.md](references/diagram-catalog.md) and apply only the selected type's construction and validation rules. Do not load or imitate unrelated diagram grammars.

When the selected grammar is unfamiliar, read its independently authored
micro-example in [references/example-patterns.md](references/example-patterns.md).
Examples teach semantic structure, not a reusable composition or palette.

### 4. Compose for the workflow

Read [references/composition.md](references/composition.md) and use only the section matching the parent context.

- For plans, keep the document executable: outcome, evidence, decisions, phases, dependencies, verification, rollout, recovery, and non-goals.
- For decisions, show alternatives, recommendation, rationale, trade-offs, evidence, and rejected options.
- For reports, preserve observations and uncertainty; visualize only relationships or change that matter.
- For tests, never convert counts into decoration. Visualize a real tested flow, state, architecture, or coverage relationship only.
- For change orientation, group by logical change and keep explanation separate from defect findings.
- For UI structure, compare at most three low-fidelity directions with representative content and explicit trade-offs.

### 5. Choose interaction deliberately

Use the least powerful interaction that solves the reading problem:

- `none`: default for most artifacts;
- `focus`: highlight a selected node and its directly related paths;
- `reveal`: play once and finish with the complete result visible;
- `step`: expose a meaningful order through Previous, Next, Play, Pause, Replay, Home, and End behavior;
- `flow`: add one slow directional trace while the static connector retains all meaning;
- `alternative`: show one proposed topology at a time without changing the accepted state.

Do not animate layout, semantic labels, data values, pass/fail meaning, or connector geometry. Hide decorative motion under reduced motion and in print. Ensure the complete meaning remains visible without JavaScript.

For a wireframe, read [references/wireframing.md](references/wireframing.md).
Keep it visibly low fidelity, use representative product language, compare at
most three structurally different directions, and implement only the
navigation, disclosure, or short task flow needed for the decision.

### 6. Render in the editorial artifact contract

Read [references/rendering.md](references/rendering.md) and
[references/theming.md](references/theming.md). Use Markdown and Mermaid when
the parent artifact surface supports them and they remain readable. Use
self-contained HTML/SVG only when custom layout or bounded interaction
materially improves understanding.

For HTML artifacts:

1. Start from [templates/artifact.html](templates/artifact.html).
2. Replace every `{{...}}` placeholder.
3. Use semantic HTML and an accessible heading order.
4. Give every meaningful SVG a title and description.
5. Keep all CSS and JavaScript inline.
6. Use the fixed editorial light/dark artifact tokens; do not offer theme variants,
   solicit a palette, or introduce unapproved colors.
7. Keep the static document complete before enhancement.
8. Add controls only for interaction that the question requires.
9. Include narrow, wide, reduced-motion, and print behavior.

Never load external scripts, styles, fonts, images, iframes, or renderers. Never use network requests, dynamic evaluation, storage, forms, popups, downloads, or parent/top navigation.

### 7. Validate before returning

Resolve supporting paths relative to the directory containing this `SKILL.md`.
Read [references/certification.md](references/certification.md). For HTML, run
the profile-aware certificate:

```bash
node "<skill-directory>/scripts/certify-artifact.mjs" <artifact.html> \
  --profile <artifact|diagram|wireframe> \
  --output <artifact.certificate.json>
```

The structural certificate is mandatory. When browser tooling is available,
also test wide, narrow, keyboard, reduced-motion, print, overflow, and console
states, save the evidence manifest described in the certification reference,
and rerun with `--browser-evidence <evidence.json>`. Do not describe a
structural-only result as visually certified.

For every format, confirm:

- the artifact answers one named reader question;
- every semantic element maps to evidence;
- the form and interaction are singular and justified;
- complexity stays within the selected type's budget or is split;
- labels and connectors remain legible without color or motion;
- static, narrow, reduced-motion, and print states remain complete;
- all uncertainties and omissions are explicit;
- the source revision is still current when freshness matters.

If a validation check fails, fix the artifact before returning it. Do not downgrade a failed security, evidence, or accessibility check to a warning.

### 8. Return through the parent workflow

Return:

- the artifact content or local path;
- selected form, diagram type, and interaction mode;
- the evidence ledger or parent-owned evidence references;
- omissions and unresolved assumptions;
- validation results;
- the source revision used.

Let the parent workflow persist the result as an Alan plan or artifact. Do not create a public URL or invoke a separate publishing command.

## Failure Handling

- **Evidence does not support the requested visual.** Produce the strongest supported prose or table, identify the missing facts, and stop before drawing unsupported semantics.
- **The diagram exceeds its complexity budget.** Produce one overview and one focused detail. Never shrink labels, remove evidence links, or combine diagram grammars to force one canvas.
- **Interactive output is incomplete without JavaScript.** Remove the enhancement or restructure the document so the static state contains every node, relationship, conclusion, and decision.
- **The source revision changed during authoring.** Mark the draft stale, refresh the changed evidence, and rerun validation before persistence.
- **The parent cannot persist HTML safely.** Return Markdown, Mermaid, or a static SVG supported by that parent. Do not publish elsewhere.
- **Browser certification is unavailable.** Return the structural certificate,
  mark browser and visual gates `not-run`, and name the unverified layout and
  interaction risks. Source inspection is not a substitute for rendered proof.

## Artifacts

This primitive produces one parent-owned artifact in the parent's supported format plus validation metadata. Generated local fixtures may be placed under `examples/generated/`; owning workflows must use their existing Alan plan, report, or artifact locations for durable output.

The primitive does not create database records, upload bundles, publish websites, or add a second review lifecycle.

## Maintenance

When a real invocation proves a routing rule, validator, template, or integration boundary wrong, update the narrowest file in this skill and add a fixture reproducing the failure. Do not add a new sibling skill for another artifact subtype; extend the routing or the relevant reference within this primitive.
