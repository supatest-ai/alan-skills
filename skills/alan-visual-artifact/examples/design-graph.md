# Artifact Template Design Graph

The POC does not modify Alan application components, so this graph scopes the standalone generated artifact rather than adding a production `/design-system` route. A production artifact-viewer integration must add its real component permutations to that route before implementation.

## Axes

| Axis | States represented |
| --- | --- |
| Form | prose/table fallback, static diagram, stepped diagram |
| Interaction | rest, hover, focus-visible, active, playing, paused, first step, middle step, final step |
| Data | complete evidence, long labels, missing optional assumptions, budgeted dense graph |
| Async | not applicable; generated artifact performs no network or background work |
| Width | narrow single column, wide diagram plus walkthrough |
| Theme | automatic light, automatic dark |
| Motion | normal, reduced motion |
| Script | enhanced, JavaScript disabled |
| Export | screen, print |
| Direction | left-to-right; RTL requires a separately authored diagram because connector direction is semantic |

## Collapsed axes

- Theme selection is deleted: the artifact follows Alan light/dark presentation automatically.
- Loading/error/retry is deleted: the document has no remote runtime.
- Arbitrary layout modes are deleted: the template has one wide and one narrow reading order.
- Multiple animation styles are deleted: only one optional directional trace and one controlled step mode remain.

## Required observations

- Every semantic step is visible before JavaScript adds the enhancement class.
- Reduced motion hides the directional trace and prevents autoplay.
- Print restores all steps and removes controls and decorative motion.
- Focus remains visible on every control.
- Long content wraps without covering connectors or leaving the reading frame.
- The static connector retains direction when the moving trace is absent.
