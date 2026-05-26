# Handoff — 2026-05-26 — Extended session: full audit + restructure + semantic re-review (18 commits)

Read this first.

## Last session (2026-05-26 — extended Edition session, 18 commits)

Single calendar day, two arcs: morning Supervisor work (12 commits, separate session per `Alex_ACT_Supervisor/HANDOFF.md`) and afternoon Edition work (16 commits in Edition + 2 Supervisor ledger commits). All pushed to `origin/main`. brain-qa Edition findings: 0.

### What shipped in Edition (16 commits)

| # | Commit | Severity | Summary |
|---|---|---|---|
| 1 | `6199f8b` | `[behaviour]` | Mirrored 9 per-type review/creator artifacts from Supervisor (Path C; ADR-007) |
| 2 | `1527048` | `[clarification]` | Batch A — strip `muscle:` field from 6 converter skills + 3 quality fixes |
| 3 | `73c19ed` | `[clarification]` | Batch B — 8 shared-core instructions mirrored byte-identical with Supervisor |
| 4 | `153f9c6` | `[clarification]` | Batch C — 20 prompts gain `## Would Revise If` + audit-apis tightening |
| 5 | `ad7ed1b` | `[behaviour]` | Batch D — 4 agents tightened (Gate 6 allowlist trims) + new doc-hygiene skill mirrored |
| 6 | `6751285` | `[clarification]` | Batch E — markdown-mermaid trimmed 1648 → 327 lines via `references/mermaid-reference.md` |
| 7 | `10f8fa3` | `[clarification]` | HANDOFF.md: audit complete record |
| 8 | `d889242` | `[clarification]` | CHANGELOG.md: populate Unreleased section |
| 9 | `93c2794` | `[behaviour]` | Per-skill consolidation — 11 skill-bound muscles moved into `skills/<name>/scripts/` |
| 10 | `7934d75` | `[behaviour]` | `muscles/shared/` → `scripts/shared/`; repaired 4 broken-ref classes in converter-qa.cjs |
| 11 | `d70a182` | `[behaviour]` | Removed `audit-apis` workflow entirely (~411 lines) |
| 12 | `ce3db4f` | `[behaviour]` | converter-qa + audit-mall-drift moved to `scripts/` top-level |
| 13 | `8ce354c` | `[behaviour]` | Full `.github/muscles/` folder collapsed; heir Mall-install path migrated to `scripts/local/**` |
| 14 | `900b8e0` | `[behaviour]` | Fit-for-mission audit: +3 skills (code-review, git-workflow, status-reporting), -1 prompt (migrate-from-alex-master), copilot-instructions.md table fixed |
| 15 | `2bd3fa0` | `[clarification]` | KEEP decision on 7 audit-flagged "niche" artifacts (user uses them extensively) |
| 16 | `06ba353` | `[behaviour]` | Playbook revisit: stripped `mode: agent` from 22 prompts, +WRif on 3 skills, mirrored `deep-review` |
| 17 | `24468a3` | `[clarification]` | Semantic-review fixes (4 review-* WRif + 2 instruction WRif + 3 mall H1 fixes + brain-auditor Gate 6 + git-workflow staleness) |
| 18 | `5913651` | `[behaviour]` | Removed `academic-paper-drafting` (683 lines vs 500 cap; user chose removal) |

Three audit passes layered on each other:

1. **Initial audit** (commits 1-8) — Path C per-type pairs mirror + 5 fix batches resolving 39 subagent-flagged Revise findings
2. **Structural restructure** (commits 9-13) — 5 commits collapsing muscles/ tier through user-steered reframes; brain reduces from 5 to 4 artifact types
3. **Fit-for-mission + semantic re-review** (commits 14-18) — 3 baseline skills added, 1 skill removed, 4 review prompts + 3 mall prompts + 2 instructions + 1 agent + 1 skill fixed

## Current Edition brain shape (post-extended-session)

- **Skills**: 30 (added: code-review, git-workflow, status-reporting, deep-review, 6 per-type review/creator pairs, doc-hygiene; removed: academic-paper-drafting)
- **Instructions**: 36 (added: 3 routing for new baseline skills; mirrored: 8 shared-core byte-identical with Supervisor)
- **Prompts**: 26 (added: 4 review-* slash commands; removed: migrate-from-alex-master + audit-apis)
- **Agents**: 4 (unchanged file count; all 4 tightened with WRif + Gate 6 allowlist trims; brain-auditor gained Method step binding search tools)
- **Muscles**: 0 (folder eliminated)

**Total: 96 artifacts** (was 94 at session start; net +2 after add/remove).

## Architecture changes (heir-visible)

- **Brain reduced from 5 to 4 artifact types** — `muscles/` retired; cross-cutting executables live in `.github/scripts/` alongside heir-lifecycle scripts; skill-bound scripts live in each skill's own `scripts/` folder.
- **Heir Mall-install destination migrated** from `.github/muscles/local/**` to `.github/scripts/local/**` (sync-policy + mall-installation updated). Heirs with content in old `muscles/local/` will see it preserved via the `unmatched:preserve` rule but should manually move to `scripts/local/` for ongoing maintenance.
- **`copilot-instructions.md` cluster table refreshed** — previously named 7 deleted instructions (debugging, scope-management, creative-loop, partnership-charter, technical-writing, skill-building, bootstrap-learning); now accurately lists only artifacts that ship.

## Shared-core byte-identity verified

All 8 always-on shared-core instructions + 4 worker agents + doc-hygiene skill + 4 newly-added skills (code-review, git-workflow, status-reporting, deep-review) are byte-identical with Supervisor (SHA-256 verified during each mirror).

## Decision: KEEP 6 audit-flagged "niche" artifacts; REMOVE academic-paper-drafting

The fit-for-mission audit (commit `900b8e0`) flagged 7 artifacts as candidates for relocation to Mall as opt-in plugins (theoretical "niche" classification):

- `agent-creator` + `agent-review` + `/review-agent`
- `markdown-sanitization-chain`
- `md-to-eml`
- `creative-writing`
- ~~`academic-paper-drafting`~~ — **removed `5913651`** after the semantic re-review found the body at 683 lines (over the 500-line skill body cap); user decided to remove rather than trim, extract, or accept-exception
- `alex-banner-generation` + `/banner`

**Decision (user, 2026-05-26):** KEEP 6 as baseline; REMOVE academic-paper-drafting on size violation. User reported extensive usage of the kept 6 in their projects. The audit's "niche" classification was theoretical generality (would a hypothetical heir need this?) rather than observed usage signal (does the actual user invoke this?). **Observed-usage wins over theoretical-generality — but cuts both ways.** The same user-as-final-classifier principle that justified KEEP for 6 artifacts also justified REMOVE for academic-paper-drafting once new information (size violation) surfaced.

**Lesson for future audits:** do not classify artifacts as "niche, move to Mall" without telemetry or explicit user confirmation. User decisions are also conditional on the info available at the time; new information can rightly reverse them.

## Falsifier carry-forward

Falsifier window **2026-08-26** (90 days) for everything shipped this session. Re-evaluate at quarterly retraining:

- If heirs report any of the removed artifacts (audit-apis, migrate-from-alex-master, academic-paper-drafting) as missed → restore from git history (`git show <pre-removal-commit>:<path>`)
- If `markdown-mermaid` trim makes the skill useless (agents can't route to references/), restore inline or restructure pointer
- If agent allowlist trims block heir workflows (illustrator can't edit, document-assembler can't search code), the cut was wrong on those tools
- If generic WRif templates on 20+ prompts never trigger their conditions, re-author per-prompt specificity
- If heirs report content lost from `.github/muscles/local/`, the `unmatched:preserve` assumption broke — investigate upgrade-self.cjs
- If 4 new baseline skills (code-review, git-workflow, status-reporting, deep-review) never fire on any heir for 90 days, the gap-fill was speculative
- If `mode: agent` resurfaces on any new prompt, brain-qa validator should be tightened to reject it (currently silently allowed)

## No release pending

Edition v2.3.0 is the live tag. 18 commits past. v2.4.0 cut deferred earlier in the day pending user direction on release timing. The Unreleased section in CHANGELOG.md documents everything that would ship.

## Resume points

- **Optional v2.4.0 release** — when ready, run `release-ritual` skill (preflight, brain-qa green, changelog ready, tag, push, announce)
- **Verify falsifiers** — at 2026-08-26 quarterly retraining, re-audit any flagged-this-session items still showing the same gate failures
- **Heir migration check** — if any heir has content in `.github/muscles/local/` from before the collapse, that content is preserved but should be moved to `.github/scripts/local/` for ongoing maintenance

## Just shipped

Edition: 16 commits `6199f8b..5913651` pushed to `origin/main`. Working tree clean.

Supervisor (separate repo): see `Alex_ACT_Supervisor/HANDOFF.md` for the morning's 12-commit + ADR-007 work + afternoon's 2 ledger updates (`c10126d`, `7f98515`).
