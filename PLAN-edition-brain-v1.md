---
status: Proposed
date: 2026-05-02
decision-maker: Fabio Correa
target: Alex_ACT_Edition v1.0.0
---

# PLAN: Edition Brain v1.0.0 Refactor

## Header

- Status: Proposed
- Date: 2026-05-02
- Decision-maker: Fabio Correa
- Target: Alex_ACT_Edition v1.0.0

## Progress Tracker

| Phase | Description | Caps | Status |
| --- | --- | ---: | --- |
| 0 | Scaffold | -- | Not started |
| 1 | Critical Thinking Core | 7 | Not started |
| 2 | Metacognition + Interpersonal | 7 | Not started |
| 3 | Session & Memory + Boundary Guards | 11 | Not started |
| 4 | Principles & Situational | 6 | Not started |
| 5 | Rituals | 6 | Not started |
| 6 | Converters (DRY SA) | 7 | Not started |
| 7 | Formatting & Authoring (SAs) | 7 | Not started |
| 8 | Infrastructure & Fleet | 6 | Not started |
| 9 | Audit | -- | Not started |
| 10 | Heir Testing | -- | Not started |
| 11 | Release v1.0.0 | -- | Not started |
| 12 | Celebrate | -- | Not started |

## 1. Goal

Ship a refactored Edition brain as v1.0.0 -- cleaner, DRY, cluster-organized, SA-ready, and tested in real heir projects.

## 2. Phases

### Phase 0: Scaffold

Rename `.github/` to `.github-v0/`, then create a fresh `.github/` with empty subdirectories:

- `instructions/`
- `skills/`
- `prompts/`
- `muscles/`
- `agents/`
- `config/`
- `scripts/`
- `episodic/`

### Phase 1: Critical Thinking Core

Migrate Group 1 (7 capabilities). These are the spine:

- act-foundations
- act-pass
- critical-thinking
- problem-framing-audit
- system-prompt-skepticism
- adversarial-review
- alternatives-and-tradeoffs

Test:

- `brain-qa` passes.
- ACT pass fires correctly on a medium-stakes request.

### Phase 2: Metacognition + Interpersonal

Migrate Groups 3 and 4 (7 capabilities). These are always-on background rules.

Test:

- Confidence language calibrates correctly.
- Emotional attunement works.
- AI-writing tells are suppressed.

### Phase 3: Session & Memory + Boundary Guards

Migrate Groups 5 and 6 (11 capabilities). Includes the new Lock shape for boundary guards.

Test:

- PII filter blocks writes.
- Terminal safety fires.
- Session handoff works.

### Phase 4: Principles & Situational

Migrate Group 7 (6 capabilities). Context-activated rules.

Test:

- Debugging instruction fires on "fix this".
- creative-loop detects stage.
- worldview fires on an ethical question.

### Phase 5: Rituals

Migrate Group 2 (6 capabilities).

Test:

- Greeting check-in fires.
- `/upgrade` works.
- `/initialize` bootstraps a fresh heir.

### Phase 6: Converters

Implement the DRY converter SA pattern:

- 1 instruction
- 1 prompt
- 1 SA
- 6 format skills
- 6 muscles
- converter-qa

Test:

- Each format converts correctly.
- QA validates outputs.

### Phase 7: Formatting & Authoring

Wire up the 3 worker SAs (`markdown-author`, `illustrator`, `document-assembler`) with their internal quality utilities.

Test:

- `/author` produces lint-clean markdown.
- `/illustrate` renders Mermaid.
- `document-assembler` stitches placeholders.

### Phase 8: Infrastructure & Fleet

Migrate Group 10 (6 capabilities).

Test:

- `/mall` finds skills.
- heir-doctor runs.
- `/status` reports.

### Phase 9: Audit

Run quality and coherence checks on the new brain:

- Run `brain-qa`.
- Run `epistemic-integrity-audit`.
- Run `coherence-check` against Skill Mall.
- Verify artifact count matches the plan: 57 capabilities, about 65 artifact files post-DRY.
- Fix any findings.

### Phase 10: Heir Testing

Deploy to 2-3 real heir projects for 2 weeks. Collect feedback via AI-Memory and fix regressions.

### Phase 11: Release v1.0.0

- Bump VERSION to 1.0.0.
- Write CHANGELOG.
- Tag.
- Push.
- Run full ACT pass (high-stakes).
- Announce via AI-Memory/announcements/.

### Phase 12: Celebrate

Acknowledge the milestone, write a retrospective, and update the Supervisor fleet registry.

## 3. Success Criteria

| Criterion | Target |
| --- | --- |
| Brain QA | `brain-qa` exits 0 on v1.0.0 |
| Functional parity | All 57 capabilities functional, no regressions from v0.9.9 |
| DRY savings | Artifact count reduced from about 79 to about 65 |
| Token budget | Always-on instructions under 15K tokens |
| Heir validation | 2+ heirs run real work for 2 weeks with no critical feedback |
| Style guard | No em-dashes anywhere |

## 4. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Heir breakage during testing | Preserve `.github-v0/` backup, rollback is one rename |
| DRY consolidation introduces gaps | Use `converter-qa` muscle to validate every output |
| SA delegation overhead exceeds savings | Phase 7 worker SAs are already proven (see SA pilot comparison) |
| Major version bump scares heirs | `upgrade-self.cjs` requires `--allow-major`, provide clear release notes |

## 5. Out of Scope

- AlexMaster framework changes (tenets, claims registry)
- Skill Mall restructuring (separate plan)
- New capabilities not in the current 57

## 6. Timeline Estimate

| Scope | Estimate |
| --- | --- |
| Phases 0-4, cognitive core | About 1 week (mostly migration plus verification) |
| Phases 5-8, work groups | About 1 week (DRY refactoring is the creative work) |
| Phase 9, audit | About 1 day |
| Phase 10, heir testing | 2 weeks |
| Phases 11-12, release plus retro | About 1 day |
| Total | About 5 weeks from start to v1.0.0 |

## 7. Rollback

At any phase, if the refactor is worse:

```bash
# Rollback sequence
mv .github .github-v1-attempt
mv .github-v0 .github
# Then ship v0.9.10 with a post-mortem
```

## 8. Falsifiability

This plan fails if any of the following are true:

- After Phase 10 testing, more than 2 critical feedback items are unresolved.
- The DRY artifact count does not actually decrease (consolidation was illusory).
- Token budget exceeds 20K for always-on instructions (cognitive core + metacognition + interpersonal + boundary guards).
- The converter SA pattern produces worse output quality than the per-format instructions it replaces.

## Cross-References

- Architecture: `decisions/ARCHITECTURE-2026-05-01-worker-agents.md` (Appendix G inventory, Appendix H tenet clusters)
- SA pilot: `decisions/SA-PILOT-RUN-COMPARISON.md`
- Current brain: `Alex_ACT_Edition/.github/` (v0.9.9)
