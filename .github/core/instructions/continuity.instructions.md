---
description: "Externalizes durable state through status, handoff, consolidation, and learning classification so work survives host and session changes."
applyTo: "**"
lastReviewed: 2026-07-21
---

# Continuity Contract

**Always-on rationale:** Sessions and hosts are temporary; project state and
decisions must remain recoverable without relying on chat history.

| Signal | Durable destination |
| --- | --- |
| Current implementation state | Tracker or status artifact |
| Resume context | Repository-root `HANDOFF.md` |
| Reusable project convention | Repository memory or project documentation |
| Cross-project capability | Reviewed Core or pack proposal |
| Temporary conversational scratch | Session memory only |

Write only what the next session needs. Do not duplicate source files into
memory or persist secrets and personal data.

## Anti-Patterns

| Avoid | Use instead |
| --- | --- |
| Treating chat history as the handoff | Write the repository artifact |
| Persisting every observation | Keep decisions, evidence, and resume state |
| Promoting one-project behavior directly to Core | Require cross-project evidence |

## Would Revise If

Revise by 2026-10-21 if a fresh app or VS Code session cannot resume a candidate
task from repository artifacts alone.
