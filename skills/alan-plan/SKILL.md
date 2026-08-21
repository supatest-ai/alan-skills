---
name: alan-plan
version: 1.1.0
description: Create an implementation plan artifact in Alan
---

# Plan Creation

You are creating an implementation plan. Your job is to analyze the problem
and produce a clear, actionable plan in markdown.

---

## How to plan

1. **Analyze** — Read the task description and any linked context. Explore the
   codebase to understand architecture, dependencies, constraints, and risks.
   Use Read, Grep, Glob freely. Do NOT write or modify any files.

   If this is a **revision request** (the user references feedback on an existing
   plan, or mentions a plan artifact), first fetch the existing plan with
   `mcp__alan__get_artifact` to understand what was already proposed.

2. **Clarify** — Before drafting, assess whether the scope is clear enough to
   plan against. If it's not — **ask questions. One at a time.**

   This is how a senior engineer operates: they don't guess, they don't
   silently fill in gaps, they don't plan against assumptions. They ask until
   they understand. Walk down each branch of the decision tree and resolve
   ambiguity before committing it to a plan.

   - Ask **one question per message**. Don't dump a list of 10 questions.
   - If a question can be answered by exploring the codebase, explore instead
     of asking.
   - If the scope or requirements are genuinely unclear, say so directly:
     _"I need more clarity on X before I can plan this well."_
   - Don't be hesitant about asking. It's not friction — it's quality control.
     A plan built on assumptions is worse than no plan.

   **Break-glass: when to skip this step.** If the task description is detailed,
   subtasks are clear, related documents exist, and the codebase exploration
   answered your open questions — go straight to Draft. Don't force
   clarification when none is needed. Read the room.

3. **Draft** — Write your plan as natural free-form markdown. Structure it
   however makes sense for this specific problem:
   - Bullet list of steps
   - Phased breakdown with dependencies
   - Decision tree with trade-offs
   - File-by-file change list
   - Whatever communicates the plan most clearly

   There is NO required format. Good plans are clear, specific, and actionable.
   Include file paths, function names, and reasoning where relevant.

   **Compose the plan for comprehension.** After the evidence and plan structure
   are stable, invoke `/alan-visual-artifact` with the plan audience, reader
   question, verified relationships, supported output formats, and constraints.
   Accept prose/table or `no visual` when they win. When a visual is earned, put
   it at the top of the section it explains and preserve the primitive's selected
   type, evidence ledger, omissions, and validation result. Planning remains the
   owner of research, decisions, approval, and `create_plan`; the visual primitive
   must not create or publish a second plan.

4. **Persist** — You MUST call the `mcp__alan__create_plan` MCP tool to save
   your plan. If you skip this, the plan is lost.

   Use the active task context when it is present in the prompt. Otherwise:
   - The task ID is available from the `ALAN_TASK_ID` environment variable.
   - The conversation ID is available from the `ALAN_SESSION_ID` environment variable.
   - Resolve `teamId` with Alan MCP context/tools before creating the plan.

   Always pass `taskId`, `conversationId`, and `teamId` explicitly. Do not
   substitute one ID for another.

   ```
   Tool: mcp__alan__create_plan
   Parameters: {
     "title": "Short descriptive title — Version N",
     "content": "<your full markdown plan>",
     "summary": "One-line summary of what this plan achieves",
     "taskId": "<active task ID or value of ALAN_TASK_ID, if set>",
     "conversationId": "<active conversation ID or value of ALAN_SESSION_ID>",
     "teamId": "<resolved team ID>"
   }
   ```

5. **Exit plan mode** — After persisting, call `ExitPlanMode` to present the
   plan for user approval. Lead with the plan title and, when possible, the
   artifact link (`/teams/<teamId>/docs?artifactId=<artifactId>`). Do not lead
   with a raw UUID; only include it as secondary debug context if no usable
   title or link is available. The user will approve, reject, or ask questions.

## Handling feedback and revisions

Feedback is not a patch request — it's a signal that your understanding was
incomplete. Treat it as a new analysis cycle, not a quick edit.

1. **Understand the feedback** — Read every point carefully. What is the user
   actually saying? Is it a correction, a concern, a missing requirement, or a
   change in direction? Don't assume you know — ask if anything is ambiguous.

2. **Ask before replanning** — If the feedback raises questions, changes scope,
   or introduces constraints you hadn't considered — ask. Get clarity before
   revising. One good question prevents a bad revision. Don't silently
   reinterpret feedback into something you're more comfortable with.

3. **Re-analyze** — Go back to the codebase. The feedback may reveal things you
   missed in the first pass. Read the relevant code again. Check assumptions
   that the feedback challenges. This is Phase 1 (Analyze) again, not a shortcut.

4. **Revise the plan** — Now rewrite with the deeper understanding. Address
   each feedback point explicitly. If you changed your approach, explain why.

5. **Persist the revision** — When saving:
   - Use the same title with an incremented version: `"Title — Version 2"`,
     `"Title — Version 3"`, etc.
   - Set `parentId` to the previous plan's artifact ID — this creates a version
     chain and marks the old plan as "superseded"
   - Reference the specific feedback points to show they were addressed
   - If the feedback includes quoted text (e.g. `On "Setup DB":`), address
     that specific section

Use `mcp__alan__get_artifact` to fetch the previous plan if you need to
reference its full content during revision.

## Available tools for plan artifacts

| Tool | Use |
|---|---|
| `mcp__alan__create_plan` | Persist a new plan (or revision with `parentId`) |
| `mcp__alan__get_artifact` | Fetch an existing plan/artifact by ID |
| `mcp__alan__update_artifact` | Update an existing plan's content/metadata |
| `mcp__alan__add_artifact_comment` | Add a comment to a plan artifact |
| `mcp__alan__resolve_artifact_comment` | Resolve a comment on a plan |

## Do NOT

- Write or modify any source files
- Execute destructive commands
- Skip the `create_plan` MCP call — the plan must be persisted
- Use any rigid sections format — write naturally, however the plan is best expressed
