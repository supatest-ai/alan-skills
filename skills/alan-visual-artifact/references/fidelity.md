# Artifact Fidelity Routing

Use the lowest fidelity that answers the named reader question. HTML is useful
only when it removes translation work: a second dimension, a state transition,
a responsive comparison, or a inspectable relationship that prose would force
the reader to reconstruct mentally.

| Form | Decision it answers | Allowed interaction | Stop condition | Certificate |
| --- | --- | --- | --- | --- |
| Prose or Markdown | What is true, proposed, or next? | Links and native disclosure only | The content is short and linear | Parent workflow checks |
| Table | How do exact fields or alternatives compare? | Sort or disclosure only when essential | Rows and columns remain readable | Parent workflow checks |
| HTML plan | How do alternatives, dependencies, overlapping work, or evidence relate? | Focus, disclosure, and linked details | The second dimension is visible without dashboard decoration | `artifact` |
| Static diagram | What relationships, flow, state, ownership, or topology matter? | None | One dominant information axis is legible at actual size | `diagram` |
| Interactive diagram explorer | Which named path crosses a dense architecture, and what does each part do? | Scenario focus and node detail | Full graph, every path, and all explanations survive without JavaScript and in print | `interactive-diagram` |
| Wireframe | Which hierarchy, grouping, navigation, density, or responsive order should be chosen? | Direction tabs, disclosure, or a short task path | Structural decision is possible before visual finish | `wireframe` |
| Mockup | Which visual treatment should be chosen after structure is accepted? | At most a comparison selector | Typography, spacing, imagery, and hierarchy can be judged without pretending behavior | `artifact` |
| Bounded prototype | Does one important path behave correctly through relevant states? | Real local controls over simulated state | Happy, failure, and recovery behavior can be exercised; production integration remains excluded | `prototype` |
| Deck | What sequence should a presenter lead an audience through? | Previous/next, arrow keys, progress | Every slide is 16:9, meaning is visible without motion, and print/export is complete | `artifact` |

## Routing questions

1. Is the content short and linear? Use Markdown.
2. Is exact comparison the work? Use a table.
3. Is one relationship grammar the work? Use a static diagram.
4. Must a reader inspect several named paths through one dense graph? Use an
   interactive diagram explorer.
5. Is unresolved structure the work? Use a wireframe.
6. Is accepted structure awaiting visual treatment? Use a mockup.
7. Is behavior and state the unresolved risk? Use a bounded prototype.
8. Is paced presentation the work? Use a deck.
9. Does an implementation plan need a real second dimension, such as
   alternatives, dependency lanes, overlapping phases, embedded evidence, or
   expandable detail? Use an HTML plan. Otherwise keep it in Markdown.

Do not combine forms merely to make an artifact feel richer. An interactive
diagram may include a concise detail panel, but it is not also a dashboard. A
prototype may contain a small orientation diagram, but it is not also an
architecture explorer. Split artifacts when two separate reader questions are
both important.

## Fidelity boundaries

- A wireframe defers finish and production behavior.
- A mockup decides finish but does not claim production behavior.
- A prototype exercises behavior but does not claim backend integration.
- A diagram explains relationships but does not become a control surface.
- A deck sequences an explanation but does not hide meaning in animation.
- An HTML plan exposes non-linear structure but remains an executable plan, not
  a status dashboard.
