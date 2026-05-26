---
name: skill-review
description: "Audits a candidate skill, instruction, or prompt against four gates (spec compliance, content quality, scope fit, safety). Use when reviewing a new draft before commit, evaluating a Mall unit or store skill for adoption, or re-auditing existing artifacts during currency-audit or quarterly retraining."
lastReviewed: 2026-05-26
---

# Skill Review

Audit a candidate skill, instruction, or prompt against four gates. This brain accepts only what passes all four.

## When to Use

Three fire contexts:

1. **Author self-audit** — dogfood your own draft before committing. Invoked from [skill-creator](../skill-creator/SKILL.md) Phase 7.
2. **External candidate adoption** — gate before pulling a Mall unit, store skill, or any external artifact into this brain. Decide *whether the artifact is fit* before adopting.
3. **Periodic re-audit** — re-check existing skills during currency-audit or quarterly retraining. Skills that no longer pass the gates revise or retire.

This skill carries the judgment checks a brain-qa validator cannot do (mechanical regex/date validation vs. content-quality judgment). Gate 1 partially overlaps with brain-qa where present; Gates 2–4 are judgment-only.

## The Four Gates

A candidate must pass **all four** to ship. Failure on any gate = decline or revise.

These gates are the canonical source of truth. [skill-creator](../skill-creator/SKILL.md) inverts them into authoring phases — if the two ever disagree, this file wins and skill-creator must follow.

### Gate 1 — Spec Compliance

| Check | Pass criterion |
|---|---|
| Frontmatter present | YAML block with `name` + `description` + `lastReviewed` (skills) or `description` + `applyTo` + `lastReviewed` (instructions) |
| `name` valid (skills) | kebab-case, ≤64 chars, matches folder name |
| `description` valid | Third-person, ≤1024 chars, names what the skill does AND when to use it |
| `applyTo` glob non-empty (instructions only) | At least one path pattern; avoid `**/*` unless justified |
| File location matches type | `*.instructions.md` in `instructions/`, `SKILL.md` in `skills/<name>/`, `*.prompt.md` in `prompts/` |
| Markdown lints clean | No broken links, no missing code-fence languages |

This gate overlaps with a brain-qa validator where present. If brain-qa passes, Gate 1 is presumptively met; spot-check the judgment items (description third-person/trigger phrases).

### Gate 2 — Content Quality

| Check | Pass criterion |
|---|---|
| Single responsibility | The artifact does one thing; if title contains "and" or "+", split it |
| Behavioral, not encyclopedic | Tells the agent what to *do*, not what a topic *is* |
| Has falsifiability or visible markers | The reader can tell whether the artifact fired correctly |
| ≤ 500 lines | Anthropic skill-spec ceiling; longer = signal of overload, split or trim |
| No duplicated content from existing artifacts | Grep for overlapping descriptions across `.github/instructions/` and `.github/skills/` |
| No graveyard prose | No "removed/dropped/used-to-have" sections; the file describes the live shape only |

### Gate 3 — Scope Fit

| Check | Pass criterion |
|---|---|
| Target brain matches scope | Generic across ≥2 projects → this brain. Project-specific → that project's local skills, not here. External-surface delivery → Plugin Mall, not here. |
| Not framework-level | Does not modify ACT manifesto, tenets, or claims registry — framework changes go through an ADR, not a skill |
| Doesn't duplicate Plugin Mall content | If the value is a marketplace listing, it goes in the Mall, not the brain baseline |

### Gate 4 — Safety

| Check | Pass criterion |
|---|---|
| No destructive defaults | Anything that deletes, force-pushes, or overwrites must require explicit user approval |
| No hardcoded credentials or PII | Run `pii-memory-filter` mentally over the diff |
| No prompt-injection vectors | If the artifact reads external content (URLs, files), it sanitizes or quotes it |
| Reversible | A user can disable or remove the artifact without breaking the brain |

## Decision Matrix

| Gates passed | Action |
|---|---|
| All 4 | **Accept** — land the change |
| 3 of 4 | **Revise** — name the failing gate and patch the candidate |
| 2 of 4 or fewer | **Decline** — name the rationale; if the decline sets precedent, draft an ADR |

## Recording the Verdict

For self-audits and routine re-audits: the verdict lives in the commit message or the conversation. No separate file.

For external adoption (Mall unit, store skill) or any decline that sets precedent: write a verdict capturing gate results, rationale, required changes (if Revise), and the act-pass trail. This is the audit trail for adoption decisions, not a ceremonial form for every audit.

## Anti-Patterns

| Anti-pattern | Correction |
|---|---|
| Accepting because the author is confident | Confidence ≠ quality. Run all four gates regardless of authorship |
| Declining without naming the gate | Always cite the specific gate; vague declines waste cycles |
| Accepting "trivial" candidates without audit | Trivial-looking changes are where regressions hide |
| Skipping the act-pass trail on non-trivial audits | Medium-stakes audits (new artifact, external adoption) require the trimmed pass; routine re-audits of unchanged artifacts do not |
| Gates drifting from skill-creator | If a gate here disagrees with a skill-creator phase, update skill-creator — this file is the source of truth |

## Falsifiability

This skill's four-gate model has failed if any of the following occur within 90 days:

- An accepted candidate (all 4 gates passed) is reported broken by 2+ heirs
- Declines cluster on one gate and are later reversed during re-audit (gate too strict or unclear)
- Repeated audits of equivalent candidates produce contradictory gate outcomes

Track these as you would any falsified discipline (commit log, retraining notes, or curation ledger if your repo ships one) tagged `[GATE-FAILURE]`.

## Related

- [skill-creator](../skill-creator/SKILL.md) — inverts these gates to author candidates that pass by construction
- [act-pass](../../instructions/act-pass.instructions.md) — required for medium-stakes audits
