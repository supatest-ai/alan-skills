# Visual Routing

Choose a form from the reader's question and evidence shape, not from the requested aesthetic.

## Form gate

| Reader need | Default | Escalate when |
| --- | --- | --- |
| Understand one conclusion or short linear procedure | Prose | Order, branching, or ownership is ambiguous |
| Compare exact mappings, requirements, options, or checks | Table | Relationships must be traversed rather than scanned |
| Understand connected components, actors, data, or dependencies | Diagram | The graph remains hard to trace at the available size |
| Decide information hierarchy, navigation, or a short UI flow | Wireframe | Click-path review is necessary |
| Explore a dense graph, ordered explanation, or alternatives | Interactive HTML | Static overview plus focused detail cannot answer the question |

Return `no visual` when escalation would add decoration rather than comprehension.

## Canonical diagram routing

| Information axis | Diagram | Use when | Avoid when | Soft budget |
| --- | --- | --- | --- | ---: |
| Components and connections | Architecture | Boundaries, responsibilities, and calls matter | Message order is the question | 12 nodes / 18 edges |
| Existing technology landscape | Current-state map | Systems must be grouped by domain, lifecycle, or modernization status | Future topology is the only question | 18 systems / 6 groups |
| Runtime placement | Deployment | Zones, processes, networks, or environments matter | It is only a logical component map | 10 nodes / 14 edges |
| Data movement | Data flow | Sources, transformations, sinks, and trust boundaries matter | Exact call order matters | 10 nodes / 16 edges |
| Branches and decisions | Flowchart | Conditions determine paths or outcomes | State persists across events | 12 steps / 4 decisions |
| Cross-functional handoffs | Swimlane | Ownership and handoff boundaries matter | Only dependencies matter | 5 lanes / 15 steps |
| Time-ordered messages | Sequence | Actor order, sync/async behavior, or retries matter | Persistent states are primary | 6 actors / 16 messages |
| Persistent lifecycle | State | Events, guards, transitions, and terminal states matter | The flow is stateless | 9 states / 15 transitions |
| Reinforcing cycle | Loop | A final stage feeds the first or a shared state accumulates | The path has a terminal outcome | 8 stages |
| Conceptual domain | ER | Entities, meaning, and cardinality matter | Physical columns and indexes are the question | 10 entities / 20 relations |
| Physical persistence | Database schema | Tables, keys, nullability, indexes, and constraints matter | Domain language is enough | 8 tables / 80 fields |
| Blockers and fan-in | Dependency graph | Prerequisites, cycles, and critical blockers matter | Chronology alone matters | 15 nodes / 22 edges |
| Hierarchy | Tree | Parent/child structure or taxonomy matters | Cross-links dominate | 4 levels / 24 nodes |
| Scope through containment | Nested map | Boundaries inside boundaries are the primary meaning | Parent/child order alone is enough | 5 levels / 18 nodes |
| Abstraction or enforcement levels | Layer stack | Responsibilities or controls belong to distinct tiers | Runtime call order matters | 6 layers |
| Ownership and escalation | Org map | Reporting or routing ownership matters | Workflow handoffs matter | 20 people or teams |
| Experience over stages | Journey | Actor goals, touchpoints, and pain across stages matter | Implementation components matter | 8 stages / 3 lanes |
| Work sliced into releases | Story map | Activities, user tasks, and release cuts must align | Calendar dates are primary | 5 activities / 3 releases |
| Work in progress | Kanban | State, WIP limits, and blocked items are real evidence | Dependencies or chronology are primary | 5 columns / 15 cards |
| Changes over calendar time | Timeline or Gantt | Real dated events or dependencies exist | Dates or duration are guesses | 16 events or tasks |
| One quantitative comparison | Bar | Exact categorical differences matter | Values are ordinal labels | 12 categories |
| Change over a continuous axis | Line | Real ordered measurements exist | Only two observations exist | 6 series / 40 points each |
| Change between two observations | Slopegraph | Direction and relative movement between exactly two states matter | There are more than two meaningful times | 12 series |
| Relationship between measurements | Scatter | Real paired numeric observations exist | Categories, not correlations, matter | 250 points / 4 series |
| Multi-criterion numeric profile | Radar | Several entities share the same 3–5 measured criteria | Criteria use incomparable units without normalization | 5 axes / 5 series |
| One cyclic numeric profile | Polar | Angle categories are cyclic and radius is a real magnitude | The categories have a simple linear order | 8 categories / 1 series |
| Part-to-whole hierarchy | Treemap | Real nested quantities exist | Readers need precise comparison | 30 leaves |
| Quantity flowing through stages | Sankey | Conserved or explicitly reconciled values exist | The links are qualitative | 12 nodes / 18 links |
| Two-variable decision space | Quadrant | Thresholds and plotted positions are evidence-backed | Axes are subjective slogans | 20 items |
| Set overlap | Venn | Membership intersection is the actual question | More than three sets or precise quantities matter | 3 sets |
| Ranked levels or conversion | Pyramid or funnel | Order or stage loss is supported by evidence | Readers need exact comparisons across many categories | 6 levels |
| Causes of one observed effect | Fishbone | Root-cause hypotheses are grouped by evidence-backed categories | Cause order or probability is the question | 6 categories / 3 causes each |
| Value chain and evolution | Wardley map | User need, dependency, and maturity movement are all material | The axes cannot be supported | 10 components / 2 movements |
| Class structure | UML class | Operations, inheritance, composition, or aggregation matter | Domain entities and cardinality are sufficient | 8 classes / 10 relations |
| Platform-wide data stack | Data-platform overview | Cluster services, storage, compute, and access form one high-level system | A generic architecture view is clearer | 12 components |
| Multi-actor operational stages | Process map | Actors perform sequential work with explicit inputs and outputs | Ownership lanes alone answer it | 6 stages / 4 actors |
| Tiered data quality | Medallion map | Storage moves through named quality or policy tiers | The tiers are merely deployment zones | 5 tiers / 12 flows |
| Source-to-consumer platform | Integration topology | Many sources converge on a platform and fan out to consumers | Individual message order matters | 18 systems / 24 links |
| Access by role and resource | Security matrix | Permitted, denied, and conditional capabilities need exact comparison | Trust-boundary topology is the question | 12 roles / 12 resources |
| UI hierarchy and navigation | Wireframe | A product-structure decision remains unresolved | The product structure is already accepted | 3 directions / 5 screens each |

Soft budgets are split signals, not targets. Create an overview and focused detail when a label becomes cramped, paths cross repeatedly, or the reader must zoom just to read.

## Selection rules

1. Name the exact reader question.
2. Identify the dominant information axis.
3. Confirm the evidence supports every element the type requires.
4. Select one canonical diagram type.
5. Apply the type's soft budget.
6. Select `none`, `focus`, `reveal`, `step`, `flow`, or `alternative` interaction.
7. Record why a simpler form did not win.

Do not combine ER and physical schema notation, sequence and state semantics, or architecture and deployment boundaries in one unlabeled grammar.

## Recurring semantic patterns

| Evidence pattern | Route |
| --- | --- |
| Many producers converge on a finite-capacity queue or bottleneck | Data flow with capacity and backlog annotations |
| Each stage repeats the same input, decision, control, and output slots | Process map with consistent stage compartments |
| Loose input becomes a governed durable artifact | Data flow that distinguishes transformation from storage |
| Two rules or policies must be compared until their first divergence | Paired flow paths with pass, fail, skipped, and not-reached states |
| Permitted and forbidden paths cross trust boundaries | Architecture map with labeled boundaries and denied paths |
| Controls belong to the layers where they are enforced | Layer stack, not a flat checklist |
| Later defenses compensate for earlier gaps and leave residual risk | Layer stack with explicit carried-forward risk |

## Plan and report defaults

- Small linear plan: Markdown.
- Requirements mapped to phases/checks: table.
- System boundary decision: decision table plus one architecture impact diagram.
- Stateful workflow: state diagram, optionally stepped.
- Multi-actor protocol: sequence diagram.
- Database change: conceptual ER first; physical schema only when columns or constraints are material.
- Test result: structured report; add a diagram only for the tested flow or unresolved recovery path.
- Routine status: prose/table; add one dependency or timeline visual only when real evidence changes a decision.
- Multi-file change orientation: logical chapters; add focus interaction only for a hard-to-trace cross-file path.

## Quantitative guardrail

Never chart invented progress, estimated confidence, unsupported coverage, nominal statuses, or counts that are clearer as text. A chart requires a numeric question, real comparable measurements, declared units, and a source.
