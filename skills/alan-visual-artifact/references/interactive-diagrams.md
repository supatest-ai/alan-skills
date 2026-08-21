# Interactive Diagram Explorers

Use an explorer when a static architecture is valid but the reader must inspect
two or more named paths through it. The interaction is a reading aid, not a
different source of truth.

## Information contract

The artifact contains:

1. a full-graph baseline with every grounded node and connector visible;
2. two to eight scenario controls, including `Everything`;
3. one selected scenario expressed with `aria-pressed="true"`;
4. a scenario explanation outside the SVG;
5. focusable nodes with a short accessible label;
6. a node-detail region outside the SVG;
7. an evidence ledger and source revision.

Define a visual grammar before placing nodes. Actors, evidence sources, decision
gates, transformations, stores or records, quality checks, and destinations
must not become interchangeable rounded boxes. Use shape, border treatment,
containment, label position, and whitespace before color. Declare node and edge
kinds in the markup so the grammar can be checked, and use ownership or trust
zones only when the boundary carries real meaning.

Treat a dense explorer as an interface, not a long document. Prefer a compact
title and scenario rail, a canvas that receives most of the viewport, subtle
meaningful zones, and one or two on-demand explanation cards. Do not place a
large hero, prose introduction, dashboard grid, permanent sidebar, or several
equally loud panels around the graph. The graph owns the stage; controls and
detail support it.

Selecting a scenario highlights its declared nodes and connectors. Unrelated
elements may dim but must not disappear, collapse, or become impossible to
read. `Everything` restores the complete architecture. Selecting a node reveals
only pre-authored, evidence-backed detail; it never creates markup from data.

## Interaction contract

- Use native buttons for scenarios.
- Make SVG nodes focusable with `tabindex="0"`, `role="button"`, and an
  evidence-specific `aria-label`.
- Activate a node with click, Enter, or Space.
- Announce scenario and node changes through one polite live region.
- Use `textContent`, `hidden`, classes, and attributes. Never use `innerHTML`.
- Do not use storage, network requests, external code, drag-and-drop, zoom
  libraries, or a theme control.
- One restrained trace may move along the selected path. Static strokes,
  labels, and arrowheads retain the complete meaning when motion is disabled.
- Stop motion when the document is hidden, under reduced motion, and in print.

Keep the interaction data model separate from presentation: every scenario
declares its node IDs, connector IDs, name, and pre-authored explanation; every
node ID maps to pre-authored detail. The renderer applies classes and hidden
states only. This makes broken paths detectable without executing the page and
prevents interaction code from inventing content.

Pan and zoom are optional, not signs of sophistication. Add them only when
inspection at several scales is part of the reader's job. Otherwise prefer a
stable overview, a contained scroller, and detail on demand.

## Responsive and print behavior

Never scale a dense wide graph down until labels become tiny. Give the SVG a
stable minimum width inside a clearly contained horizontal scroller, preserve
keyboard focus visibility, and keep the scenario and detail panels in reading
order. An overview plus focused detail is preferable to a miniature full graph.

Print exposes the complete graph, every scenario explanation, and every node
detail. It hides interactive controls and motion only; it does not print just
the currently selected path.

Start from [templates/interactive-diagram.html](../templates/interactive-diagram.html)
when the explorer form wins. Run the `interactive-diagram` certificate profile.
