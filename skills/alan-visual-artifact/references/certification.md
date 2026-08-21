# Artifact Certification

Certification has three gates. Report each gate separately; never collapse a structural pass into a claim that the rendered artifact is visually correct.

## Gate 1: structural and policy checks

Run `scripts/certify-artifact.mjs` with the selected profile. It performs dependency-free checks for:

- self-contained HTML and prohibited capabilities;
- fixed editorial light/dark tokens, approved colors, and rejection of gradients,
  glows, theme controls, or palette drift;
- semantic landmarks, one primary heading, accessible SVG titles/descriptions, focus, narrow, print, and reduced-motion contracts;
- diagram node bounds/overlap metadata, connector labels, unique references, and declared view boxes;
- scoped motion, static-first meaning, controls, stop conditions, and reduced-motion behavior;
- wireframe direction count, selector relationships, representative content, low-fidelity styling, and wired review controls.

The certificate records the artifact SHA-256, profile, executed checks, and whether browser evidence was supplied. Any structural failure is blocking.

## Gate 2: rendered browser evidence

When a browser is available, exercise the same artifact bytes recorded by the certificate at:

- wide viewport, at least 1280 by 800;
- narrow viewport, at most 390 CSS pixels wide;
- keyboard path through every implemented control;
- reduced-motion mode;
- print or print-preview mode;
- long-label or overflow stress state when content varies;
- every direction, step, alternative, disclosure, or recovery state.

Inspect screenshots rather than trusting capture success. Reject blank, clipped, stale, wrong-state, or illegible evidence. Check the console and page-level horizontal overflow.

Save a JSON evidence manifest and pass it to the certifier:

```json
{
  "artifactSha256": "<64 lowercase hex characters>",
  "checks": {
    "wide": "pass",
    "narrow": "pass",
    "keyboard": "pass",
    "reducedMotion": "pass",
    "print": "pass",
    "overflow": "pass",
    "console": "pass"
  },
  "captures": ["<local evidence path>"],
  "notes": []
}
```

Every check must be `pass`, `fail`, or `not-applicable`. A `fail` blocks
certification. Use `not-applicable` only with a note explaining why. Include at
least one non-empty note recording the visual inspection. Capture files must
have a valid PNG, JPEG, or WebP signature and the manifest hash must match the
artifact.

## Gate 3: visual and semantic judgment

Inspect label collisions and wrapping; clipped nodes, arrowheads, focus rings, and annotations; ambiguous connector ownership and edge crossings; distinctions that must survive without color; whether the form beats prose/table; and whether motion explains meaning instead of decorating it.

Record unresolved judgment in the evidence manifest notes. Scripts can prove declared structure and policy; they cannot prove taste, correctness of the evidence, or whether a different diagram communicates better.

## Certificate levels

- `structural`: Gate 1 passed; rendered and visual-semantic checks remain unverified.
- `browser-backed`: Gate 1 passed and a matching all-pass browser manifest was supplied; visual-semantic notes remain agent judgment.
- `rejected`: any mandatory check failed.

Do not use the word `certified` without the level.
