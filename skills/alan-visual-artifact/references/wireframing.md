# Bounded Wireframing

Use a wireframe only when the unresolved decision concerns information hierarchy, grouping, navigation, action placement, content density, responsive reflow, or a short task flow. It is a decision artifact, not an alternate product implementation.

## Frame the decision

Record the user and job, bounded screen or flow, required information and actions, accepted constraints, exact structural question, and decisions deliberately deferred to production design.

Use real labels and representative content. Do not use lorem ipsum or anonymous boxes when wording, field length, status, ownership, or action labels affect layout.

## Directions

When structure is unsettled, compare two or three meaningfully different directions in one file. Change a real product decision such as navigation model, grouping/order, primary-action placement, overview versus steps, density, or mobile reflow. Color changes and minor card rearrangements are not separate directions.

Give every direction a descriptive name, one-sentence hypothesis, one tradeoff, the same core requirements and representative content, and explicit assumptions or omitted behavior.

Use one keyboard-operable selector. Keep the selected direction exposed through `aria-selected`, `aria-controls`, and a visible heading. If the structure is already accepted, render one direction and omit the selector.

## Intentionally low fidelity

- Use the editorial theme's neutral tokens, system type, plain borders, limited radius, and no shadows, gradients, illustrations, accent fills, or decorative metrics.
- Keep spacing and typography legible enough to judge hierarchy without suggesting production polish.
- Represent imagery as labeled placeholders unless the asset changes a structural decision.
- Use annotations only for an assumption, open question, boundary, or behavior that cannot be shown directly.

## Interaction boundary

Implement only controls needed to test navigation, disclosure, selection, next/back behavior, or a short task flow.

- Use native links, buttons, inputs, and headings.
- Make every included control work with keyboard and visible focus.
- Remove dead controls; label real-product handoffs as out of scope.
- Do not add persistence, authentication, simulated APIs, elaborate state management, drag-and-drop, or production-like animation.
- Keep the complete comparison readable without JavaScript; enhancement may switch the focused direction but must not hide alternatives from print/export.

## Responsive contract

Design narrow behavior instead of shrinking the desktop canvas. Check reading order, labels, wrapping, action order, contained overflow, and touch targets. Directions must remain structurally distinct at wide and narrow widths.

Use [templates/wireframe.html](../templates/wireframe.html) when a comparison artifact is needed. Run the `wireframe` certification profile before returning it.
