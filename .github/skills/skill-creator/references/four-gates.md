# Four Gates — Quick Reference

> **Single source of truth: [`.github/skills/skill-review/SKILL.md`](../../skill-review/SKILL.md).** This file is the author-facing quick-ref. If the two disagree, `skill-review` wins.

Inversion of the four gates. Use as a pre-commit self-audit checklist.

## Gate 1 — Spec compliance

- [ ] Frontmatter has all required fields (`name`, `description`, `lastReviewed`)
- [ ] `description` is third-person, names both *what* + *when* (trigger phrases), ≤1024 chars
- [ ] `name` is kebab-case, ≤64 chars, matches folder name
- [ ] Skill lives in the right repo for its scope (this brain for generic-enough skills, Mall for external-surface delivery)
- [ ] No dropped fields present (`type`, `application`, `applyTo`, `inheritance`, `tier`, `currency`, `lifecycle`)
- [ ] Markdown lints clean (no MD001/MD040/MD060/etc.)

## Gate 2 — Quality

- [ ] Single responsibility — title is one verb, no "and"/"+"
- [ ] Behavioral, not encyclopedic — section headers are verbs or instructions
- [ ] Has a `## Would Revise If` section with at least one **specific** falsifier (date, count, observable event — not "after sufficient passes")
- [ ] ≤500 lines (skills) — overflow goes to `references/`, `assets/`, or `examples/`
- [ ] No duplication of content owned by another artifact (cross-link instead)
- [ ] At least one anti-pattern table or comparison surfaces what the skill is *not*

## Gate 3 — Scope fit

- [ ] Not framework-level (manifesto, tenets, claims registry) — those route to ADRs
- [ ] Generalizes to ≥2 projects or ≥2 sessions of use (otherwise it's a one-off script/prompt)
- [ ] Not redundant with a Mall unit — if a Mall unit covers this, adopt instead of reauthor
- [ ] Routing decision documented in the skill itself or its `Related` section

## Gate 4 — Safety

- [ ] No destructive defaults — deletes/force-pushes/overwrites require explicit confirmation
- [ ] No hardcoded credentials, no PII, no real client/employer names
- [ ] External-content reads specify sanitization
- [ ] Reversible — disabling the skill (deleting its folder, or moving it out of `.github/skills/`) does not break the brain

## Verdict matrix

| Gates passed | Verdict |
| --- | --- |
| 4 of 4 | **Accept** |
| 3 of 4 | **Request revision** — specify which gate and what fix |
| ≤2 of 4 | **Reject** — fundamental issue; rework or abandon |
