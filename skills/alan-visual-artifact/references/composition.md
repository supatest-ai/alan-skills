# Artifact Composition

Use this reference after form selection. Load only the section matching the parent workflow.

## Plan

Keep a rich plan executable rather than dashboard-like.

1. Outcome: beneficiary, changed capability or decision, current pain, and success evidence.
2. Grounding: verified current behavior, constraints, non-goals, and unresolved assumptions.
3. Concept model: one visual only when it establishes vocabulary, boundaries, lifecycle, or dependencies.
4. Requirements: map each requirement to a phase and a verification method.
5. Decisions: recommendation, alternatives, rationale, trade-offs, evidence, and rejection reasons.
6. Implementation: contracts and implementation heart first, dependent behavior next, glue last.
7. Operations: compatibility, migration, rollout, observability, recovery, and rollback where relevant.
8. Critic pass: missing components, bottlenecks, data quality, security, accessibility, and stale assumptions.
9. Coverage: map every requirement and affected surface to one planned write set, validation step, or explicit non-goal.

Do not invent duration, owners, status, or completeness.

## Decision

Use a comparison table as the primary decision surface:

| Field | Content |
| --- | --- |
| Decision | The exact choice to make |
| Constraints | Non-negotiable boundaries |
| Options | Mutually distinguishable alternatives |
| Recommendation | One proposed selection |
| Rationale | Why it best satisfies the constraints |
| Trade-offs | Costs and risks accepted |
| Evidence | Verified facts supporting the comparison |
| Rejected options | Why each was not selected |
| Revisit trigger | Evidence that should reopen the choice |

Add one impact diagram only when alternatives change topology, dependencies, lifecycle, or UI hierarchy. In an interactive preview, display one alternative at a time and keep the accepted state visually distinct.

## Report

Structure operational and status reports as:

1. Executive finding.
2. Verified observations.
3. Interpretation.
4. Risks or blockers.
5. Decisions required.
6. Next actions.
7. Evidence and provenance.

Prefer prose and tables. Add one visual when it exposes a dependency, trend, lifecycle, or architecture relationship that changes what the reader should do.

## Test report

Preserve the testing workflow's evidence and confidence boundaries:

- scope and environment;
- scenarios and checks;
- passed, failed, blocked, skipped, and unverified states;
- exact evidence links or paths;
- observed defects and reproduction;
- recovery paths not exercised;
- compatibility boundaries;
- residual risk.

Never turn pass/fail counts into a donut, progress ring, score, or fabricated coverage percentage. A flow/state diagram is valid only when it explains what was exercised or why a recovery path remains unverified.

## Change orientation

Explain a changeset before defect review:

1. Establish the fixed source revision and changed-file set.
2. Group files into logical changes, never folders for their own sake.
3. Order the implementation heart first, consequences next, and glue last.
4. Explain what changed, why, alternatives or constraints, and implications.
5. Include every changed file exactly once or mark it explicitly unplaced.
6. Keep orientation separate from severity-ranked review findings.
7. Mark the result stale if the source revision changes.

## UI-structure decision

Use a bounded wireframe only when hierarchy, navigation, disclosure, or a short task flow remains undecided.

- Show representative content, not lorem ipsum.
- Compare at most three materially different structures.
- State one trade-off for each structure.
- Keep presentation low fidelity and neutral.
- Implement only the controls needed to compare navigation or disclosure.
- Include narrow and wide reading order plus keyboard operation.

Do not simulate a backend, persistence, permissions, production state, or polished product behavior.

## Evidence ledger

The ledger may remain in parent workflow state or travel beside a local artifact during the POC:

```json
{
  "question": "What must the reader understand or decide?",
  "sourceRevision": "parent-owned revision identifier",
  "claims": [
    {
      "id": "claim-1",
      "kind": "observation",
      "text": "A semantic claim shown in the artifact",
      "sources": ["path, artifact, test, log, or parent evidence id"]
    }
  ],
  "assumptions": [],
  "omissions": []
}
```

This is transient composition metadata, not a new Alan database model.
