# Alan Skills

Official agent skills published by [Alan](https://tryalan.ai) — Supatest's software factory agent.

These skills extend coding agents with the workflows Alan uses internally for planning, PR creation, code review, CI checks, PRD writing, structured documents, and feature testing. They follow the [open `SKILL.md` standard](https://github.com/anthropics/skills) and work with Claude Code, Codex CLI, Cursor, Gemini CLI, OpenCode, and other compatible agents.

## Install

### One command, any agent — via [skills.sh](https://skills.sh)

```bash
# All Alan skills
npx skills add supatest-ai/alan-skills

# A specific skill
npx skills add supatest-ai/alan-skills --skill alan-test-feature

# List what's in this repo without installing
npx skills add supatest-ai/alan-skills --list
```

The `npx skills` CLI auto-detects your installed agent (Claude Code, Codex, Cursor, Gemini, OpenCode) and writes skills to the right path.

### Manual install

Clone this repo and copy the skill directories you want into your agent's skills location:

| Agent | Path |
|---|---|
| Claude Code | `~/.claude/skills/<name>/` |
| Codex CLI | `~/.codex/skills/<name>/` |
| Gemini CLI | `~/.gemini/skills/` or `~/.agents/skills/<name>/` |
| OpenCode | `~/.config/opencode/skills/<name>/` (also reads `~/.claude/skills/`) |
| Cross-agent | `~/.agents/skills/<name>/` |

## Available skills

| Skill | What it does |
|---|---|
| [`alan-plan`](skills/alan-plan) | Build a clear, persisted implementation plan via codebase analysis and one-question-at-a-time interview. |
| [`alan-visual-artifact`](skills/alan-visual-artifact) | Select and render evidence-backed diagrams, bounded wireframes, and self-contained interactive HTML for Alan plans, reviews, decisions, and reports. |
| [`alan-review-pr`](skills/alan-review-pr) | Review a GitHub PR — security, correctness, performance — and post inline comments via Alan's MCP. |
| [`alan-test-feature`](skills/alan-test-feature) | Test a feature end-to-end with `agent-browser` — captures, S3 upload, structured test report. |

Several of these skills call Alan's MCP server (`mcp__alan__*`) for persisting plans, documents, test reports, and GitHub operations. Without the Alan MCP server installed, the body of each skill is still a useful workflow guide, but the persistence steps will need adapting.

## Versioning

This repo follows semantic versioning via git tags (`v0.1.0`, `v0.2.0`, etc.). Pin your install to a tag for stability:

```bash
npx skills add supatest-ai/alan-skills@v0.1.0
```

Default `main` always reflects the latest published skills.

## Contributing

Skills here are mirrors of what Alan ships internally. If you'd like to contribute or report an issue, open one at [github.com/supatest-ai/alan-skills/issues](https://github.com/supatest-ai/alan-skills/issues).

## License

Apache-2.0 — see [LICENSE](LICENSE).
