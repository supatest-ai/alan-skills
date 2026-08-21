# Diagram Micro-Examples

Use one row only after routing has selected its type. These examples are
independently authored semantic skeletons: substitute verified Alan evidence
for every noun, value, and relationship. Do not copy their layout blindly and
never reuse an example's content as evidence.

| Type | Reader question | Minimal semantic skeleton |
| --- | --- | --- |
| Architecture | Which boundary owns each capability and connection? | `Web -> API -> worker`, with auth and queue boundaries labeled |
| Current-state map | What exists now and what lifecycle state is it in? | observed systems grouped by domain, each labeled keep/retire/migrate |
| Deployment | Where does each runtime execute and fail? | client -> ingress -> API/worker inside zones -> database, with failure domains |
| Data flow | How does evidence become a durable artifact? | source -> validate -> normalize -> store -> viewer, with rejected input branch |
| Flowchart | Which decision sends work down each path? | request -> “evidence complete?” -> compose or return missing-evidence result |
| Swimlane | Who owns each handoff? | planner / visual primitive / artifact store lanes with payload labels |
| Sequence | In what order do participants exchange messages? | workflow -> primitive -> validator -> artifact store, plus validation failure alt |
| State | Which stable states and recovery transitions exist? | draft -> validated -> persisted; validation failure -> revision -> validated |
| Loop | What improves on each cycle and when does it stop? | compose -> inspect -> critique -> revise -> compose, exit on accepted evidence |
| Dependency graph | What must finish before another task can start? | token contract -> template -> validator -> workflow integration -> PR proof |
| Process map | What enters, governs, and leaves each stage? | evidence input / policy / transformation / artifact output per stage |
| ER | Which domain records relate and with what cardinality? | task 1—N artifact; artifact 1—N revision; revision 1—N evidence link |
| Database schema | Which physical constraints enforce those relations? | table fields with PK/FK/nullability/unique labels and exact foreign-key paths |
| Tree | What is the single-parent hierarchy? | workflow -> plan/report/review -> artifact section children |
| Nested map | What is truly contained by each scope? | Alan viewer contains artifact; artifact contains sections; section contains visual |
| Layer stack | Which layer may depend on which? | workflow ownership -> composition -> rendering -> certification -> persistence adapter |
| UML class | Which code contracts inherit or compose? | artifact request composes evidence ledger and render policy; renderer implements port |
| Data-platform overview | How do platform roles connect? | ingestion / processing / storage / governance / serving / consumer groups |
| Medallion map | Which acceptance rule advances data quality? | raw evidence -> verified claims -> publishable artifact, with quarantine path |
| Integration topology | How do sources and consumers cross the platform boundary? | plans/reports/tests -> artifact primitive -> website/plan viewer |
| Security matrix | Which role may perform which artifact action? | actor rows x read/create/revise/persist/share columns with policy citations |
| Org map | Who owns execution, review, and escalation? | owner -> reviewer relationship, with escalation labeled separately |
| Journey | Where does one actor experience friction? | request -> inspect plan -> resolve decision -> approve, with observed pain evidence |
| Story map | Which user tasks land in each release slice? | activities across top, tasks below, MVP and later release cuts |
| Kanban | What real work is blocked and why? | queued/in progress/review/done with WIP labels and blocker text |
| Timeline or Gantt | Which sourced dates constrain delivery? | phases on dated axis with milestone, dependency, and uncertainty labels |
| Wireframe | Which information hierarchy best supports the decision? | overview-first vs step-first using identical outcome/evidence/decision requirements |
| Bar | Which categories differ on one measured unit? | validator failures by category, zero baseline, direct values, source label |
| Line | How does one measure change over ordered observations? | artifact render duration by dated run, gaps explicitly marked |
| Slopegraph | How did comparable items change between two points? | before/after validation time per artifact family with both values labeled |
| Scatter | Are two measured variables associated? | node count x inspection time per artifact, units and sample disclosed |
| Radar | How do entities compare on shared normalized criteria? | at most five artifacts x accessibility/clarity/density criteria with scale declared |
| Polar | How does one measure vary across a true cycle? | incidents by hour-of-day or weekday, fixed order and radial baseline |
| Treemap | How is one additive total divided hierarchically? | validation runtime by profile then check, exact totals retained in labels/table |
| Sankey | How does a conserved quantity split and reconcile? | candidate claims -> accepted/rejected/unresolved -> rendered/omitted totals |
| Quadrant | Where do measured items fall against two thresholds? | artifact types by reader value x authoring cost, units and threshold rationale |
| Venn | Which evidenced members belong to overlapping sets? | plan/report/test artifacts with exact members listed by region |
| Pyramid or funnel | Where does a measured population fall out? | requests -> eligible visuals -> validated -> persisted, counts and population basis |
| Fishbone | Which hypotheses may explain one observed defect? | clipped label effect with evidence/layout/content/browser cause groups |
| Wardley map | Which dependency capabilities vary by maturity? | reader need -> artifact -> renderer/validator dependencies positioned with rationale |

## Example-use checks

- The title names the real reader question rather than the diagram family.
- Every substituted noun and connector has an evidence-ledger entry.
- The chosen skeleton is discarded if prose or a table remains clearer.
- The fixed artifact tokens come from `theming.md`; examples never authorize a new
  palette, composition, font, icon set, or decorative treatment.
