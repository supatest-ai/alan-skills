# Visual Artifact Theming

Use this contract for every HTML or SVG artifact. It deliberately removes
open-ended art direction: agents do not choose a palette, ask a theme question,
or infer colors from the subject.

The palette is fixed, but composition is not. Before styling, decide the
audience, reading job, artifact form, fidelity, dominant organizing idea, and
interaction boundary. Use representative copy because wording and length shape
the layout. Number elements only when the order is meaningful. Reject a generic
dashboard arrangement when the subject calls for a path, comparison, spatial
model, sequence, or editorial document.

## One theme, two presentation states

Every artifact declares `data-artifact-theme="editorial"` on `<html>` and supports:

1. editorial light, declared on `:root`;
2. editorial dark, declared inside `@media (prefers-color-scheme: dark)`;
3. `:root[data-theme="dark"]`, which repeats the dark token assignments; and
4. `:root[data-theme="light"]`, which repeats the light token assignments.

The explicit host attribute overrides the operating-system preference. Do not
add a theme toggle inside the artifact. Alan's viewer owns presentation state.
These tokens belong to generated plans, diagrams, reports, and wireframes only;
they must not be sourced from or pushed into Alan's product-interface UI.

## Required semantic tokens

Warm cream is the default presentation. Ink, stone, and paper carry the broad
fields; restrained olive is the only general focus and selection accent. Do not
use orange-on-charcoal as the default diagram treatment.

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `#FAF9F5` | `#141413` | Warm paper page ground |
| `surface` | `#FFFFFF` | `#1F1F1D` | Cards and diagram nodes |
| `surface-muted` | `#F0EEE6` | `#2A2A28` | Secondary regions and zones |
| `text` | `#141413` | `#FAF9F5` | Primary text and structural stroke |
| `text-muted` | `#3D3D3A` | `#D1CFC5` | Secondary text |
| `text-soft` | `#87867F` | `#87867F` | Tertiary labels |
| `accent` | `#788C5D` | `#9DB07C` | Focus, selection, and at most one focal path |
| `accent-soft` | olive at 12% | olive at 16% | One verified gate or selection region |
| `accent-foreground` | `#FAF9F5` | `#141413` | Text on a solid accent |
| `border` | `#D1CFC5` | `#3D3D3A` | Rules and node borders |
| `info` | `#5E7A9B` | `#82A0C0` | Informational annotation only |
| `success` | `#7C8F6F` | `#9CAF8F` | Verified success only |
| `warning` | `#B8915A` | `#D3AD7A` | Verified warning only |
| `danger` | `#9C6B50` | `#B88670` | Verified failure or destructive state only |

Use only the declared paper, ink, silver, or black alpha values for shadows and
translucent structural fills. Shadows remain neutral; colored glows are forbidden.

## Quantitative series exception

Most diagrams use only neutrals plus `accent`. A measured chart that genuinely
needs multiple series may use this fixed artifact series set:

| Token | Value |
| --- | --- |
| `series-sage` | `#7C8F6F` light / `#9CAF8F` dark |
| `series-blue` | `#5E7A9B` light / `#82A0C0` dark |
| `series-mustard` | `#B8915A` light / `#D3AD7A` dark |
| `series-rust` | `#9C6B50` light / `#B88670` dark |
| `series-slate` | `#6E6479` light / `#8D8298` dark |

Use the fewest series tokens required. Directly label every series and pair
color with line style, marker shape, pattern, or text. These colors never become
page chrome, card fills, headings, ambient decoration, or status semantics.

## Typography and shape

- A restrained system serif owns the document title and rare editorial aside.
- System sans owns body text, controls, nodes, and headings inside diagrams.
- System mono is limited to code, paths, IDs, axes, and aligned technical
  values.
- Use the 4px spacing grid, 4–8px diagram radii, and 12px document cards.
- Use borders and surface contrast before shadows.
- Keep broad color fields cream, paper, ink, or stone. Olive is a small focal
  signal, not a wash.
- Wireframes use the same tokens but stay grayscale except for the focus ring.

## Anti-template gate

Reject the artifact when it contains:

- any raw color outside this contract;
- gradients, colored shadows, neon accents, or ambient glows;
- gradient hero treatments or large tinted backgrounds;
- arbitrary per-section accent colors;
- decorative status colors, emoji markers, or fabricated metrics;
- a palette picker, theme prompt, theme toggle, or downloaded font;
- color as the only carrier of state, direction, or category.

`scripts/validate-theme.mjs` enforces the machine-checkable subset. Browser
review still confirms contrast, visual hierarchy, and whether the focal accent
remains restrained.
