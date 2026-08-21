# Alan Artifact Rendering

Use this reference only after the primitive has selected HTML/SVG.

## Fixed visual language

The complete token contract and override order live in
[`theming.md`](theming.md). That contract is normative; this section is the
short rendering reminder.

Use the artifact pack's own warm-cream light state and deep-ink dark state.
This is deliberately independent from Alan's product-interface design system.
Use a restrained system serif for document titles, system sans
for reading and labels, and system mono for paths, code, IDs, and technical
values. Do not download fonts. Use 4px spacing increments, compact radii,
neutral shadows, and the olive accent on at most one focal path or decision.

Do not expose palettes, skins, theme selectors, brand variants, or
creative-direction questions. The artifact supports exactly two presentation
states—editorial light and editorial dark—selected by the host's `data-theme`
attribute or the operating-system preference. They are states of one artifact
theme, not agent-selectable visual directions.

## Document structure

Every HTML artifact contains:

1. document title and one `h1`;
2. concise intent and provenance;
3. an evidence-aware summary visible before interaction;
4. semantic sections in reading order;
5. diagrams as inline SVG with `role="img"`, `<title>`, and `<desc>`;
6. native buttons for interaction;
7. explicit assumptions, omissions, and validation status;
8. print and narrow-width behavior.

Keep the DOM close to the reading model. Do not render a canvas-only document or hide essential content behind hover, animation, or modal interaction.

## Connector contract

- Draw a visible static connector for every relationship.
- Use arrowheads only when direction has meaning.
- Label ambiguous connectors directly.
- Route paths so they do not cross labels or nodes.
- Use dashed paths only for a declared semantic such as proposed, optional, or asynchronous.
- Keep at least 8px clearance between connectors and unrelated labels.
- Give each moving trace a visible static path underneath it.

## Interaction contract

Enhance only after the static document exists.

- Add the enhancement class from JavaScript after controls and content are available.
- Keep focus visible and never move focus automatically during playback.
- Announce step changes through a polite live region.
- Support Previous, Next, Home, End, Play/Pause, and Replay when step mode is used.
- Stop autoplay when the tab becomes hidden, the user pauses, or reduced motion is active.
- Use one slow path trace for directional emphasis. Do not animate all connectors.
- Keep controls out of print and hide decorative traces under reduced motion.

## Security contract

A generated artifact is a document, not an application runtime.

Disallow:

- `http:` or `https:` assets and protocol-relative URLs;
- external scripts, stylesheets, fonts, images, media, embeds, objects, and iframes;
- `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, or beacon calls;
- cookies, local/session storage, IndexedDB, service workers, or caches;
- `eval`, `Function`, dynamic script creation, or string-to-markup injection;
- forms, uploads, downloads, popups, or parent/top navigation;
- secrets, credentials, private tokens, or raw unredacted sensitive evidence.

Use text nodes or authored static markup. Never concatenate untrusted evidence into `innerHTML`.

## Responsive and export states

| Axis | Required states |
| --- | --- |
| Width | narrow single-column, wide reading frame |
| Color | automatic light and dark |
| Motion | normal and reduced motion |
| Script | JavaScript enabled and disabled |
| Output | screen and print |
| Data | missing optional evidence, long labels, dense-but-budgeted graph |
| Interaction | rest, hover, focus-visible, active, disabled, selected |

The complete semantic result must exist in every state. Interaction may change emphasis or pacing, never meaning.

## Self-contained template

Start from `templates/artifact.html`. Replace all placeholders and delete unused
sections. The template contains no external assets or publishing hooks. Run the
profile certificate from the parent `SKILL.md`; it includes the theme validator.
