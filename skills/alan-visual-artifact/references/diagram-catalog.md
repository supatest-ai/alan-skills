# Diagram Catalog

Read this file only after `routing.md` selects a diagram. Each type has one semantic grammar. Preserve that grammar instead of borrowing shapes or connectors from another type.

## System, flow, and behavior

| Type | Required evidence | Construction contract | Reject or split when |
| --- | --- | --- | --- |
| Architecture | Named components, boundaries, responsibilities, and real connections | Group by trust or ownership boundary; label every non-obvious connection with action/protocol; distinguish external actors | The reader actually needs runtime placement or message order |
| Current-state map | Existing systems, domain grouping, lifecycle/modernization state | Show observed systems first; encode status with text plus style; keep proposed replacements in a separately labeled area | Current and target state become visually indistinguishable |
| Deployment | Runtime units, environments/zones, placement, and network paths | Nest processes inside real environment/network boundaries; label ingress, egress, replication, and failure domains | Logical components lack verified placement |
| Data flow | Sources, transformations, stores, sinks, and trust boundaries | Use action labels on flows; distinguish transformation from persistence; mark async buffers and sensitive-boundary crossings | Exact time order or persistent state is the primary question |
| Flowchart | Steps, decisions, branch conditions, and terminal outcomes | Phrase decisions as questions; label every outgoing branch; converge only when the later behavior is truly shared | Branch labels are missing or state persists across events |
| Swimlane | Actors/teams plus owned steps and handoffs | One lane per real owner; put each action in exactly one lane; label handoff payloads and rejection/return paths | Lanes represent technologies rather than ownership |
| Sequence | Actors, ordered messages, sync/async behavior, retries/errors | Order participants left to right by entry-to-dependency; label calls with intent; show alternative/error blocks only when evidenced | More than six actors or sixteen messages obscure the critical path |
| State | Stable states, triggering events, guards, and terminal/recovery states | Use nouns for states and events on transitions; mark initial, terminal, retry, and invalid transitions when material | Nodes are merely procedural steps with no persistence |
| Loop | Repeating stages, feedback signal, accumulation or stop condition | Make the feedback edge explicit; name what changes each cycle; show the exit or safety limit | The process actually terminates after one pass |
| Dependency graph | Work/components plus prerequisite relationships and blockers | Direct edges from prerequisite to dependent; highlight the critical blocker with a label, not color alone; expose cycles | Chronology or calendar dates are the reader's question |
| Process map | Operational stages, actors, inputs, outputs, and controls | Use consistent stage compartments; show accepted input, governing decision/control, output, and failure handoff | It duplicates a simpler swimlane without adding inputs/controls |

## Data and software structure

| Type | Required evidence | Construction contract | Reject or split when |
| --- | --- | --- | --- |
| ER | Domain entities, identity, relationships, and cardinality | Use domain names; show required/optional cardinality; include only attributes needed to explain identity or relationship meaning | Physical keys/indexes are the main decision |
| Database schema | Tables, columns, types, keys, nullability, constraints, and indexes | Mark PK/FK/unique/nullability explicitly; connect real foreign keys; separate proposed changes from current fields | More than eight tables or eighty fields prevents readable labels |
| Tree | Parent/child structure and root | Keep one parent per node unless explicitly modeling aliases; sort siblings by a stated rule; label omitted subtrees | Cross-links dominate or depth exceeds four readable levels |
| Nested map | Containment boundaries and scope | Nest only true containment; label boundary meaning; keep the deepest content readable without zoom | Containment is being used to imply ownership or call order |
| Layer stack | Ordered abstraction/enforcement tiers and responsibilities | One responsibility class per layer; label allowed dependency direction and enforcement point; show bypasses explicitly | The system permits arbitrary peer calls that contradict layering |
| UML class | Classes/interfaces, operations, inheritance, composition, aggregation | Use correct relation notation and direction; show only operations/fields relevant to the design question | Domain cardinality alone would be clearer as ER |
| Data-platform overview | Platform services, storage, compute, governance, and access | Group ingestion, processing, storage, governance, serving, and consumers; mark control plane separately from data plane | A generic architecture map answers the question with fewer concepts |
| Medallion map | Real quality/policy tiers and movement rules | Name the acceptance rule and data quality change at each tier; show quarantine/rejection paths | Tier names are decorative deployment zones |
| Integration topology | Sources, platform boundary, integration modes, and consumers | Group systems by role; label batch/stream/request paths; show convergence and fan-out without implying false chronology | Individual request/retry order is material |
| Security matrix | Roles, resources/actions, and allow/deny/conditional decisions | Put exact roles on one axis and capabilities on the other; include legend text; cite policy source/version | Trust boundaries or attack paths are the primary question |

## Hierarchy, ownership, product, and planning

| Type | Required evidence | Construction contract | Reject or split when |
| --- | --- | --- | --- |
| Org map | Teams/people, reporting or escalation relationships | Label relationship type; keep functional collaboration out of the reporting tree unless separately styled | The real question is a workflow handoff |
| Journey | Actor, stages, goals, touchpoints, and evidenced pain/outcome | Keep one primary actor per lane; distinguish observed behavior from proposed improvement; attach evidence to pain points | Implementation topology is the reader's question |
| Story map | Activities, user tasks, priority/order, and release cuts | Arrange backbone left to right and detail vertically; draw release slices explicitly; preserve user language | Calendar dates, not release slices, control order |
| Kanban | Real work items, states, WIP limits, and blockers | Show WIP limits and blocked reason text; do not fabricate cards from prose status | It would become a decorative status board without live evidence |
| Timeline or Gantt | Real dates/durations, dependencies, milestones | State timezone/date basis; distinguish milestone from duration; show uncertainty explicitly rather than false precision | Dates or durations are estimates without a source |
| Wireframe | Unresolved hierarchy/navigation/task-flow decision and representative content | Compare no more than three low-fidelity directions; keep the same requirements across alternatives; annotate trade-offs and key click paths | The accepted production design is already known or visual polish is the question |

## Quantitative comparisons

All quantitative types require a named measure, declared unit, comparable population, source, and treatment of missing data. Never convert ordinal status or invented confidence into a number.

| Type | Required evidence | Construction contract | Reject or split when |
| --- | --- | --- | --- |
| Bar | Categories and one comparable numeric measure | Use a zero baseline for magnitude; sort by meaning; print values when precision matters | Categories exceed twelve or labels require rotation to fit |
| Line | Ordered axis plus repeated numeric measurements | Use consistent intervals or disclose gaps; label series directly; show uncertainty/missing spans honestly | Only two observations exist or order is categorical |
| Slopegraph | Exactly two comparable observations per series | Align the two axes; label both values and direction; reduce crossings through stable ordering | More than twelve series or more than two meaningful times exist |
| Scatter | Paired numeric observations and optional groups | Label units and sample; use transparency for overlap; annotate only evidence-backed outliers | A trend line would imply unsupported causality |
| Radar | Three to five shared, normalized measured criteria | Use one scale and direction; label normalization; compare no more than five entities | Axes use incomparable units or the profile hides exact differences |
| Polar | Cyclic categories and a real radial magnitude | State cyclic order and radial baseline; use one series by default; label values | Categories are simply linear or angle implies unsupported importance |
| Treemap | Nested part-to-whole quantities | Area maps one additive measure; label hierarchy and value; group small leaves honestly | Readers need precise cross-branch comparison |
| Sankey | Quantities that are conserved or reconciled across stages | Label node totals and link values; account for loss/other; preserve flow direction | Values do not reconcile or links are merely qualitative |
| Quadrant | Two numeric dimensions, thresholds, and item positions | Label axes/units and threshold rationale; print item labels; expose boundary uncertainty | Axes are subjective slogans without measurement |
| Venn | Membership in two or three sets | Label every region; list or count members only from evidence; use a table when exact membership dominates | More than three sets or overlap area would falsely imply quantity |
| Pyramid or funnel | Ordered levels or measured conversion stages | Label counts/rates and population basis; preserve stage order; expose loss between stages | Width would imply a quantity that is not measured |

## Analysis and strategy

| Type | Required evidence | Construction contract | Reject or split when |
| --- | --- | --- | --- |
| Fishbone | One observed effect and grouped, evidence-backed cause hypotheses | Put the effect at the head; group causes by a meaningful taxonomy; mark hypothesis versus confirmed cause | The diagram implies probability, order, or proof that evidence does not support |
| Wardley map | User need, dependency chain, maturity position, and movement | Anchor at the user need; map value-chain visibility and maturity separately; cite why each position/movement is chosen | Either axis is invented or components lack a real dependency chain |

## Cross-type validation

Before returning any diagram:

1. Give it a title that states the reader question, not the diagram type.
2. Keep labels readable at the target container width without zoom.
3. Label every connector whose meaning is not structurally obvious.
4. Use text, shape, or pattern in addition to color for status and emphasis.
5. Keep current, proposed, observed, inferred, and unresolved elements distinguishable.
6. Cite or link the evidence ledger from the artifact or its parent section.
7. Split at the soft budget instead of shrinking labels or crossing unrelated paths.
8. Verify the chosen grammar answers the question more clearly than prose or a table; otherwise return `no visual`.
