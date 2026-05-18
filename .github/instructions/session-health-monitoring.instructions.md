---
type: instruction
lifecycle: stable
inheritance: inheritable
description: "Monitor session health, manage context window, and ensure continuity across sessions"
application: "Always active — unconscious monitoring of session state and context capacity"
applyTo: "**"
currency: 2026-05-18
lastReviewed: 2026-05-18
---

# Session Health Monitoring

Monitor context usage and ensure graceful session transitions. Token-cost details for specific operations live in `tool-awareness.instructions.md` and skill bodies; this file owns session-level signals.

## Proxy Heuristics

VS Code does not expose token counts. Estimate via:

| Signal | Interpretation |
|--------|----------------|
| ~4 characters | ≈ 1 token |
| Large file read (500+ lines) | ~2,000-5,000 tokens |
| Base64 image in response | ~10,000-50,000 tokens (avoid — write to file) |
| Unfiltered terminal output | Variable, often 1,000+ tokens (use `Select-Object -First 20`) |

## Warning Signs

| Signal | Action |
|--------|--------|
| Forgetting early conversation context | Update session memory, suggest new session |
| Responses truncating unexpectedly | Reduce output verbosity, offload to files |
| Repeated clarification of established facts | Context may be dropping off |
| User mentions "you forgot" or "we discussed" | Acknowledge, re-read session memory |

## Checkpoints

- **After 6+ exchanges**: consider updating session memory
- **Before image work / large reads**: warn about token cost, confirm approach
- **After major milestone**: summarize progress to session memory
- **If unsure about capacity**: offer to start fresh session with handoff

## Graceful Handoff

When approaching session limits or switching topics, write `/memories/session/[name].md` with: state, completed work, next steps, pending decisions. Suggest: "New session can read `/memories/session/[file].md` to continue."
