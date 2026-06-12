<!-- markdownlint-configure-file {"MD024": {"siblings_only": true}} -->

# Changelog

All notable changes to Alex ACT Edition.

## [Unreleased]

## [3.6.0] - 2026-06-12

**Minor [behaviour] — VS Code 1.124 settings drift correction. Removes schema-rejected values from baselines; corrects `chat.permissions.default` enum.**

Full-repo audit 2026-06-12 against the live VS Code 1.124 schema surfaced three settings the brain shipped to heirs that VS Code now rejects, plus four documentation-drift items. The live JSON schema validator was the ground truth (not the cached release-notes prose) — several settings the brain copied from VS Code 1.122 release notes had different schema-accepted values when the build finally landed.

### Changed

- `.github/config/heir-workspace-settings-baseline.json` — `chat.permissions.default` value corrected from `"defaultApprovals"` (schema-rejected) to `"default"`. Valid enum is `default` / `autoApprove` / `autopilot`. `$comment` block updated with the corrected enum names + a note that VS Code 1.124 enabled Autopilot Preview by default (the brain's pin to `default` is the deliberate opt-out for ACT's permission discipline). Merge mode stays `set-if-absent` so heirs with deliberate `autoApprove` / `autopilot` overrides are preserved.
- `.github/config/welcome-baseline.json` — audit date bumped 2026-05-26 → 2026-06-12; refresh range 1.121-1.123 → 1.121-1.124.
  - Category 4 `$comment` documents removal of `chat.tools.terminal.backgroundNotifications` (deprecated by VS Code; notifications are now always-on).
  - Category 5 `$comment` documents removal of `chat.utilityModel` + `chat.utilitySmallModel` (schema rejected `"gpt-4o-mini"`; only `""` is accepted now; users should set utility-model routing via the Chat: Manage Language Models UI introduced in 1.106+).
  - Category 8 `$comment` adds the heir-workspace `chat.permissions.default: default` companion + the 1.124 Autopilot-default context.
- `.github/instructions/tool-awareness.instructions.md` — "VS Code 1.122 conveniences" section becomes "VS Code 1.122–1.124 conveniences". New rows: 1.123 session sync + `/chronicle` (clarifies the brain's local `chronicle` skill is adjacent, not replaced), 1.123 sandbox network-retry, 1.124 Autopilot enabled by default, 1.124 Advanced Autopilot opt-in. Table gains a `Release` column.
- `README.md` — Utility-slot row in the model legend and the `chat.utilityModel` / `chat.utilitySmallModel` row in the Practical Recommendation table rewritten: Edition no longer pins a value in `welcome-baseline.json`; users route utility models via the Chat: Manage Language Models UI.
- `test/workspace-settings-merger.test.js` — test fixtures rewritten to use the current VS Code enum (`default` / `autoApprove` / `autopilot`) instead of the invalid `defaultApprovals` / `bypassApprovals` strings. The merger tests test merge LOGIC, not VS Code SCHEMA, so this is a documentation-quality fix — future readers don't see invalid enum values in test fixtures. All 69 tests pass.

### Removed

- `chat.tools.terminal.backgroundNotifications` from welcome-baseline.json (VS Code-deprecated).
- `chat.utilityModel` from welcome-baseline.json (schema-rejected for hardcoded model names).
- `chat.utilitySmallModel` from welcome-baseline.json (same).

### Brain contract: no change

`min_extension_version: 9.4.0`, `brain_subtrees: [.github]`, `marker_schema: v2`. Manifest spec stays at 1.4. Edits are settings-baseline corrections + documentation refreshes; no install-contract surface changes.

### Heir impact

Heirs running `/upgrade` from any 3.x release:

- Fresh heirs (no prior `chat.permissions.default`): get the corrected `"default"` value pinned.
- Heirs that received `"defaultApprovals"` from any prior baseline: `set-if-absent` preserves their value, so the schema warning in their `.vscode/settings.json` persists. **Manual fix is the cheapest cleanup**: edit `"defaultApprovals"` → `"default"` (or pick `autoApprove` / `autopilot` if a deliberate override is desired). VS Code's fallback behaviour means the warning is cosmetic, not breaking.
- Heirs that received `chat.tools.terminal.backgroundNotifications` / `chat.utilityModel` / `chat.utilitySmallModel` via `/configure-vscode`: those keys remain in user-scope settings.json until manually removed. Running `/configure-vscode-verify` will surface them as drift; they are not removed automatically because `welcome-baseline` is additive (the prompts apply baseline; they do not unset keys absent from baseline).

### Falsifier

If VS Code 1.125+ further changes any of the three corrected settings (`chat.permissions.default` enum values, `chat.utilityModel` schema, or deprecates more terminal-chat keys), re-audit. Re-evaluate this release's documentation by 2026-09-12 (90 days). Earlier triggers: any heir feedback that the schema warning on `defaultApprovals` is actually breaking VS Code behaviour, or first observed contradiction between the live schema and the brain's documented enum values.

## [3.5.0] - 2026-06-10

**Minor [behaviour] — Mac/Linux command parity for `/configure-vscode`, `/configure-vscode-verify`, `/mall-refresh`.**

Audit 2026-06-10 (post-AP-01/AP-11 fleet adoption) surfaced that several lifecycle prompts shipped Windows PowerShell as the only working reference command. Heir agents on Mac/Linux were lifting `$env:APPDATA` and `ConvertFrom-Json -AsHashtable` verbatim, then failing.

### Changed

- `.github/prompts/configure-vscode.prompt.md` — "Windows Reference Command" section becomes "Reference Commands", adds working bash/zsh implementation (uses `$OSTYPE` to pick macOS `~/Library/Application Support/Code/User/settings.json` vs Linux `~/.config/Code/User/settings.json`, then Node one-liner for the merge). PowerShell block preserved verbatim. Both shells perform the same non-destructive merge.
- `.github/prompts/configure-vscode-verify.prompt.md` — adds "Reference Commands (read-only audit)" section with bash/zsh + PowerShell implementations. Both compute Compliance/Drift/Missing counts and print a drift table; neither writes to `settings.json`.
- `.github/prompts/mall-refresh.prompt.md` — ` ```pwsh ` fences on `node .github/scripts/audit-mall-drift.cjs` invocations changed to ` ```bash `. The commands are platform-neutral; the misleading shell label was the bug.
- `.github/scripts/audit-mall-drift.cjs` — catalog discovery candidate list gains `~/Development/Alex_Skill_Mall/` on Mac/Linux (symmetric to the existing Windows `C:\Development\Alex_Skill_Mall\` fallback). Discovery order unchanged: sibling first, then home, then Development root, then home root, then GitHub raw HTTPS.

### Brain contract: no change

`min_extension_version: 9.4.0`, `brain_subtrees: [.github]`, `marker_schema: v2`. Manifest spec stays at 1.4. All edits are additive (more shells supported, more discovery paths tried).

### Heir impact

Heirs on `/upgrade` from any 3.x release receive the refreshed prompts and the extra catalog discovery candidate. Heirs who had to translate PowerShell to bash by hand on every fresh-Mac install no longer need to. Zero breaking change to any existing workflow.

### Falsifier

The three-shell reference is decorative if 90 days pass (re-evaluate 2026-09-10) and no Mac/Linux heir invokes the new bash block (heir feedback shows agents still defaulting to PowerShell). If so, narrow to a single Node one-liner that works on all three.

## [3.4.1] - 2026-06-10

**Patch [behaviour] — close `bootstrap_templates` leak + fix cross-platform test bugs.**

Fleet-adoption batch shipped 2026-06-10 (AP-01/03/07/11/12) added `.github/dependabot.yml` to Edition. That file lives under HEIR_OWNED in `_registry.cjs` (heirs own their own dependency policy), but `build-edition-manifest.cjs listBootstrapTemplates()` inferred its bootstrap-template list from HEIR_OWNED literal-path entries that exist in Edition. Curator-only `.github/dependabot.yml` therefore joined `bootstrap_templates`, meaning the Extension would install Edition's curator-side dependency policy file into every heir on first install.

### Fixed

- `.github/scripts/_registry.cjs` now exports an explicit `BOOTSTRAP_TEMPLATES` array — the subset of HEIR_OWNED that's genuinely heir-starter-template (cognitive-config, .vscode/extensions, .vscode/settings). Adding a row here is now an explicit curator decision, not an inferred side-effect of touching HEIR_OWNED.
- `.github/scripts/build-edition-manifest.cjs listBootstrapTemplates()` reads `BOOTSTRAP_TEMPLATES` directly instead of filtering HEIR_OWNED. The regenerated manifest contains the same 3 entries as before today's leak (cognitive-config.json + extensions.json + settings.json); `.github/dependabot.yml` correctly excluded.
- `test/registry.test.js readProfile/writeProfile` tests now manage both `USER` (Unix) and `USERNAME` (Windows) env vars. Pre-fix, the tests set only `USERNAME` and passed only on Windows where `USER` is typically unset; on macOS / Linux `USER` always wins, so the tests returned the default profile instead of the user-specific one (3 failures on `npm test`).

### Heir impact

Heirs running `/upgrade` against Edition v3.4.1 (via Extension v9.4.0+) will no longer receive Edition's curator `dependabot.yml` as a bootstrap template. Heirs that already received it on a v3.4.0 install can safely `rm .github/dependabot.yml` — the file is heir-owned per `_registry.cjs`. Extension v9.5.1 adds a defense-in-depth source-side HEIR_OWNED filter on the subtree copy that catches this same leak class for any future Edition release.

### Brain contract: no change

`min_extension_version: 9.4.0`, `brain_subtrees: [.github]`, `marker_schema: v2`. Manifest spec stays at 1.4. `BOOTSTRAP_TEMPLATES` is a build-side artifact, not exposed in the manifest contract.

### Falsifier

The explicit BOOTSTRAP_TEMPLATES list is decorative if 90 days pass (re-evaluate 2026-09-10) without any new curator-only HEIR_OWNED file joining Edition that would have been incorrectly inferred. If no such pressure surfaces, the explicit list is still load-bearing (it documents intent), but the falsifier is the gap between intent-as-policy and intent-as-mechanism.

## [3.4.0] - 2026-06-07

**Minor [behaviour] — Adopt 4 authoring + prose-quality skills from Hermes Agent.**

Closes named gaps in Edition baseline: no pre-write planning discipline (`plan`), no feasibility validation (`spike`), no test-first enforcement (`test-driven-development`), no deep on-demand prose humanization beyond the always-on `markdown-author` agent's 15-word filter (`humanizer`). All four load on description match — token cost is on-demand, not always-on.

Adapted from [Hermes Agent](https://github.com/NousResearch/hermes-agent) (Nous Research, MIT) which itself ports from [obra/superpowers](https://github.com/obra/superpowers), [GSD](https://github.com/gsd-build/get-shit-done), and [blader/humanizer](https://github.com/blader/humanizer). All upstream sources MIT or MIT-compatible; attribution preserved in each SKILL.md footer.

### Added

- `[behaviour]` `.github/skills/plan/SKILL.md` — new skill. Plan-mode authoring discipline: write a concrete actionable markdown plan with bite-sized tasks (2-5 min each), exact file paths, complete code, verification steps, before any non-trivial implementation. Saves to `docs/plans/`. Adapted from Hermes Agent / obra/superpowers (MIT). Falsifier 2026-09-07. Loaded on description match — `/plan`, "design before building", multi-file work.
- `[behaviour]` `.github/skills/spike/SKILL.md` — new skill. Throwaway feasibility experiments: decompose an idea into 2-5 questions, build minimal observable prototypes under `spikes/<NNN>-<name>/`, return VALIDATED / PARTIAL / INVALIDATED verdict. Adapted from Hermes Agent / GSD (MIT). Falsifier 2026-09-07. Composes with `problem-framing-audit` (frame-first) and `plan` (post-validation build).
- `[behaviour]` `.github/skills/test-driven-development/SKILL.md` — new skill. RED-GREEN-REFACTOR enforcement for any production code change. Iron Law: no production code without a failing test first. Carves out throwaway prototypes, generated code, configuration files. Adapted from Hermes Agent / obra/superpowers (MIT). Falsifier 2026-09-07. Composes with `systematic-debugging` (test reproduces bug) and `plan` (every plan task starts with RED).
- `[behaviour]` `.github/skills/humanizer/SKILL.md` + `.github/skills/humanizer/examples/full-example.md` — new skill. Strips 29 documented AI-writing patterns (Wikipedia's "Signs of AI writing" via blader/humanizer) from any prose. Fires on "humanize", "de-AI", "un-ChatGPT", or voice-match requests. Iterative draft → self-audit → final loop. Optional voice calibration from a user-provided writing sample. Composes with `markdown-author` agent's always-on 15-word banned-vocabulary filter (humanizer is the deeper on-demand pass) and Cardinal Rule 2 (em-dash ban; humanizer Pattern 14 documents the underlying reason). Adapted from Hermes Agent / blader/humanizer (MIT). Falsifier 2026-09-07 (sinks to Mall rather than removing entirely).

### Changed

- `[clarification]` `.github/config/welcome-baseline.json` — `$comment` refreshed against VS Code 1.123 release notes (2026-06-03). Categories header now reads `VS Code 1.121-1.123`. New sub-note under category (1) documents the 1.123 supply-chain feature: auto-updates apply a 2-hour delay after a new extension version is published (trusted publishers — Microsoft / GitHub / OpenAI — are exempt). `extensions.autoUpdate: true` semantics unchanged; the delay is an implicit platform behaviour, not a setting we can configure. No `settings` object change, no heir-visible behaviour delta.

### Brain contract

`min_extension_version`: 9.4.0 (no change). `brain_subtrees`: `[.github]` (no change). `marker_schema`: `.act-heir.json` v2 (no change). Brain contract: no change.

### Heir upgrade

`/upgrade` from any 3.x release fetches the 4 new skill folders automatically; no `--allow-major` needed. Skills load on description match — heirs that never invoke `/plan`, `/spike`, TDD workflows, or "humanize this" requests see zero behaviour change.

### Falsifier

2026-09-07 (90 days) — per-skill event-based falsifiers in each new SKILL.md `## Would Revise If`. If by then any of the 4 skills has zero observed invocations across the fleet, sunset that skill (TDD + humanizer sink to Mall rather than removing entirely). Track in `Alex_ACT_Supervisor/docs/ledgers/curation-log.md` tagged `[HERMES-TIER-A-ADOPTION]`.

## [3.3.0] - 2026-06-03

**Minor [behaviour] — Per-key merge mode for the workspace-settings baseline + pin `chat.permissions.default` on fresh installs.**

Heir feedback flagged that Edition holds policy locks for the Claude Agent permission surfaces (`claudeAgent.allowAutoPermissions: false` and `claudeAgent.allowDangerouslySkipPermissions: false` in `welcome-baseline.json`) but is silent on VS Code 1.122's `chat.permissions.default` — the workspace-scope chat permission level. Heirs who flipped Bypass or Autopilot had no policy signal from the brain.

The fix adds the safe default to the workspace baseline, but workspace-scope clobber on every `/upgrade` is the wrong shape: permission level is a per-repo workflow choice, not a fleet-wide policy stance. So this release also extends the merger with a new `set-if-absent` mode — pin on fresh installs, respect heir overrides on upgrade.

### Added

- `[behaviour]` `.github/scripts/shared/workspace-settings-merger.cjs` — new `mergeMode` map (per-key, optional) in the baseline JSON. Two modes:
  - `enforce` (default — used when `mergeMode` omits the key) — current behaviour: object deep-merge or scalar overwrite. The three existing `chat.*Locations` discovery keys keep this mode by default (their sub-keys must always be present or local skills/prompts/agents stop loading).
  - `set-if-absent` — skip wholesale if heir already has the key (under any value, including object/scalar/null). Use when the brain wants a safe default on fresh installs but respects per-repo heir overrides on upgrade.
- `[behaviour]` `.github/config/heir-workspace-settings-baseline.json` — new key `chat.permissions.default: "defaultApprovals"` with `mergeMode: { "chat.permissions.default": "set-if-absent" }`. Fresh heirs get the safe VS Code default pinned at bootstrap; heirs that deliberately flip to `bypassApprovals` (experimental sandbox) or `autopilot` (long-running solo task) are never overwritten on `/upgrade`.
- `[behaviour]` Merger result now carries a `skipped` array alongside `changes`. `formatChangeSummary` surfaces respected overrides so bootstrap and upgrade scripts can tell heirs exactly which keys the merger did NOT touch and why.
- `[clarification]` 7 new tests in `test/workspace-settings-merger.test.js` covering `set-if-absent` on fresh repo, heir-existing value (no change), heir explicit `null` counts as presence, mixed `enforce` + `set-if-absent` routing in same baseline, default `enforce` behaviour preserved when `mergeMode` absent, and `formatChangeSummary` skipped-overrides surfacing.

### Changed

- `[clarification]` `.github/config/heir-workspace-settings-baseline.json` `spec_version` bumped 1.0 → 1.1 (additive `mergeMode` field, backward-compatible — readers that ignore `mergeMode` default to `enforce`).
- `[clarification]` `.github/config/README.md` — added missing `heir-workspace-settings-baseline.json` row to the ownership table; new "How the workspace-settings merger applies the heir baseline" section documents the two modes.
- `[clarification]` `.github/scripts/shared/workspace-settings-merger.cjs` — header docstring expanded to document `mergeMode` semantics and link to the new proposal.
- `[clarification]` Added intentional-divergence audit markers to shared-core brain artifacts that ship with Supervisor-curated heir-portable phrasing (skill-creator, skill-review, agent-creator, agent-review, instruction-creator, instruction-review, prompt-creator, prompt-review, code-review, meditation, brain-audit). No behavior change; the markers make the audit trail explicit per shared-core-coherence-audit.
- `[clarification]` Mirrored `markdown-mermaid` and `alex-banner-generation` skills (and the `markdown-mermaid/references/` reference set) from Supervisor to clear documentation drift.

### Brain contract

`min_extension_version`: 9.4.0 (no change). `brain_subtrees`: `[.github]` (no change). `marker_schema`: `.act-heir.json` v2 (no change). Brain contract: no change.

### Heir upgrade

`/upgrade` from any 3.x release applies the new key per its mode:

- Heir who never set `chat.permissions.default` → gets `defaultApprovals` written to `.vscode/settings.json` (visible in upgrade output as one applied change).
- Heir who already set it (any value) → no change; upgrade output reports `respected 1 heir override`.

No `--allow-major` needed. No manual action required for either case.

### Falsifier

2026-09-03 (90 days) or any VS Code release that removes/renames `chat.permissions.default` or changes its valid value set — re-evaluate the baseline key and the heir-feedback channel that drove the change.

**Patch [clarification] — documentation and tooling cleanup, plus dead-file purge. No observable behavior change for any working consumer.**

### Removed

- `[behaviour]` `.github/scripts/shared/index.mjs` — orphaned ESM bridge that imported a `./svg-pipeline.cjs` module which never existed in git history or on disk. Loading the bridge threw `Cannot find module` for any consumer that tried. Audit confirmed zero live consumers; `converter-qa.cjs` only stat-checked its presence, never imported it. Honest cleanup; an ESM bridge can be reintroduced when a real ESM consumer arrives.

### Fixed

- `[clarification]` `.github/scripts/converter-qa.cjs` — md-to-html suite now skips gracefully when pandoc is absent, matching the guard the md-to-word, html-to-md, and docx-to-md suites already had. Eliminates the 2 spurious failures that appeared on machines without pandoc. Also dropped the presence-check line for the deleted `shared/index.mjs`.
- `[clarification]` `README.md` — corrected skill/prompt counts (33 skills, 27 prompts) to match the actual brain shape; was lagging at 32/26.
- `[clarification]` `.github/copilot-instructions.md` — removed two dead skill references from the cluster table (`mall-installation` and `converter` skills do not exist; the `/mall-*` prompts and 6 format skills already cover those domains). Added `alex-banner-generation` skill and `/convert` prompt as accurate replacements.

## [3.2.0] - 2026-05-31

**Minor [behaviour] — manifest spec 1.4 lands the static-fetch Extension contract (per [ADR-009](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/docs/adrs/ADR-009-extension-github-fetch-brain.md)).**

Pure infrastructure release: brain content is unchanged from v3.1.0. This release exists to ship the `edition-manifest.json` contract fields that Alex_ACT_Extension v9.4.0+ reads at install time to validate which subtrees it may install, what minimum Extension version is required, and what marker shape to write. Heirs running Edition v3.1.0 or earlier continue to work; the new fields are additive and null on legacy reads.

### Added (manifest spec 1.4 — static-fetch Extension contract)

- `.github/config/extension-contract.json` — hand-authored sidecar declaring `min_extension_version`, `brain_subtrees`, `marker_schema`. Source of truth for the static-fetch Extension contract (ADR-009).
- `.github/scripts/build-edition-manifest.cjs` bumped to spec 1.4; merges the sidecar fields into the generated `.github/config/edition-manifest.json` at release time. Fields are null on legacy reads (sidecar absent).

### Changed

- `.github/config/edition-manifest.json` carries `min_extension_version: 9.4.0`, `brain_subtrees: [".github"]`, `marker_schema: {file_name: ".act-heir.json", version: 2}`. Read by [Alex_ACT_Extension](https://github.com/fabioc-aloha/Alex_ACT_Extension) v9.4.0+ static-fetch path to validate the install contract before any destructive op. See [ADR-009](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/docs/adrs/ADR-009-extension-github-fetch-brain.md).

**Brain contract**: spec_version 1.3 → 1.4, min_extension_version 9.4.0, brain_subtrees [".github"], marker_schema v2.

---

> **CHANGELOG discipline note (added 2026-05-30 per ADR-009 Phase 1A.6)**: every release entry going forward includes a `**Brain contract**:` line. Empty (`Brain contract: no change`) is valid; non-empty entries call out one or more of: `min_extension_version bumped to X.Y.Z`, `brain_subtrees changed (added X, removed Y)`, `marker_schema bumped to vN`. Source of truth for fleet upgrade impact analysis. Bumping `min_extension_version` is a breaking change for any heir whose Extension is older than the new floor.

## [3.1.0] - 2026-05-29

**Minor [behaviour] — Plugin Mall v3 catalog integration (Phase 5a) + shared-core audit fixes.** Rewrites `/mall-search` and `/mall-show` prompts to read the new trust-scored Plugin Mall catalog (`catalog/index.json` + `catalog/stores/*.json`) per [PLAN-mall-automation v3 / ADR-008](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/docs/adrs/ADR-008-mall-self-curation.md). Replaces legacy `CATALOG.json` lookups. Also bundles today's shared-core audit fixes that brain-auditor surfaced against Edition.

### Added (Phase 5a — Plugin Mall v3)

- **`/mall-search`** now reads `catalog/index.json` (trust-ranked, ~1.4 MB), surfaces Mall-curated entries (🏆) at the top by trust score (provenance bonus +50), shows store + version + truncated description per result. Falls back to GitHub raw URL when local Mall clone unavailable.
- **`/mall-show`** is new — drills into one plugin from `catalog/stores/<store>.json` and displays full metadata: trust score + every signal that fed it, `adapted_from` (for Mall-curated entries), `frontmatter.standard` + `extended` + `raw` layers, `available_refs` (default branch + SHA + tags), `source_url`.
- **`/mall-install`** placeholder: deferred to Phase 5b once heir feedback validates which install workflows actually matter (shape-handling, pinning strategy, multi-file with references). Today heirs install manually from `source_url` per the prompt's instructions; Phase 5b automates with a `mall-install.cjs` script.

### Fixed (audit findings from brain-auditor dispatch 2026-05-29)

- **`system-prompt-skepticism.instructions.md`** (high severity) — replaced broken reference to nonexistent `worldview-integration.instructions.md` with the actual file `worldview.instructions.md`. The drift had been shipping descriptive prose pointing at a file that doesn't exist; heirs reading the always-on instruction saw a dangling reference.
- **`problem-framing-audit/SKILL.md`** (medium severity) — replaced 2 references to nonexistent `/reframe` prompt with the actual prompt name `/problem-framing-audit`. Pure mirror gap (Supervisor was already correct).
- **`brain-auditor.agent.md` + `brain-audit/SKILL.md`** (medium severity) — mirrored Supervisor's Phase 7b stale-architecture row + Mall sibling-repo handling (added when the Supervisor brain was stripped of Mall operational artifacts after Mall self-curation went live).
- **`docx-to-md/SKILL.md`** (medium severity) — removed dead Related-skill reference to nonexistent `md-scaffold`.
- **`md-to-word/SKILL.md`** (medium severity) — removed 5 dead Related-skill references: `pptx-generation`, `md-scaffold`, `book-publishing`, `svg-graphics`, `brand-asset-management`. None of these skills ship in Edition.

### Changed (shared-core architecture)

- **`critical-thinking/SKILL.md`** — rewrote the documented 3-leg epistemic triad to 2 legs (anti-hallucination + critical-thinking). The `awareness` skill body referenced in the prior triad doesn't ship in either Supervisor or Edition; documentation now matches shipped reality. Error-detection during reasoning is currently distributed across `epistemic-calibration` (self-correction triggers table) + `reliance-nudges` (repeated-same-error nudge). If a heir reports the gap, restore `awareness` as a dedicated skill — tracked for 2026-08-29 retrospective.

### Heir-visible behaviour delta

- A heir running `/mall-search code-review` on Edition v3.1.0 sees Mall-curated entries at the top with trust scores (vs legacy CATALOG.json keyword match with no trust signal).
- The new `/mall-show <name>` command surfaces the full signal breakdown — heirs can audit *why* a plugin scored what it scored before installing.
- Always-on instructions no longer reference nonexistent files (worldview-integration).
- Critical-thinking docs no longer describe a triad leg that doesn't ship.

## [3.0.1] - 2026-05-29

**Patch [behaviour] — additive brain refresh + terminology alignment + protection contract.** Bundles four post-v3.0.0 commits that were not yet released, adds the protected-repo contract, adds a doc-hygiene routing instruction, and renames the heir-facing AI-Memory references to "shared memory bus" for terminology consistency with the sibling-repo architecture. No removals, no schema changes.

### Added

- **`.act-protected.json`** at repo root declaring `kind: edition`, `bootstrap_allowed: false`. Tells the Extension's AlexMaster-detection modal and `migrateFromAlexMaster` command to refuse Edition itself as a migration target. Pairs with the Extension-side guard (Extension v8.x patch — see Extension CHANGELOG).
- **`.github/instructions/doc-hygiene.instructions.md`** — pattern-applied routing pointer (`applyTo: "**/*doc*audit*,**/*doc*quality*,**/*drift*,**/*hygiene*"`) that fires on doc-audit / drift / hygiene file patterns and delegates to the existing `doc-hygiene` skill body.
- **`anti-hallucination` skill** mirrored from Supervisor brain-auditor findings; sibling `markdown-author` agent folds in the prior `ai-writing-avoidance` content (commit `45dbeae`).
- **Always-on rationale paragraphs** mirrored across shared-core instructions from Supervisor (commit `2fcf31d`) — names why each always-on rule earns its per-turn budget.
- **brain-auditor** refreshed for the AI-Memory sibling-repo architecture and frontmatter-spec / applyTo-calibration gap-close (commits `d87eea9`, `189daac`).

### Changed

- **Terminology**: heir-facing prompts and instructions now say "shared memory bus" (or "shared memory") instead of "AI-Memory" — `cross-project-isolation.instructions.md`, `greeting-checkin.instructions.md`, `meditation.instructions.md`, `checkin.prompt.md`, `feedback.prompt.md`, `mall-contribute.prompt.md`, `note.prompt.md`, `save-session-note.prompt.md`, `.github/config/README.md`. The underlying sibling repo `../Alex_ACT_Memory/` is unchanged; only the prose terminology updated.
- **`meditation.instructions.md`** intentional-divergence marker added: Edition omits the Supervisor-only "Quarterly Retraining Integration" section; meditation frontmatter guidance updated to match the spec-aligned shape (`description`, `applyTo` for instructions; `name` + `description` for skills; `lastReviewed` always).
- **`cross-project-isolation.instructions.md`** intentional-divergence marker added: Edition includes feedback-channel paths in `applyTo` and a "Fleet feedback" channel row — heir-side surfaces Supervisor doesn't write to.
- **`mall-contribute.prompt.md`** frontmatter guidance for new Mall SKILL.md files updated from the legacy 9-field shape to the spec-aligned `name` + `description` + `lastReviewed`.
- **`.github/VERSION`** → `3.0.1`.

### Heir-visible behaviour delta

- A heir on v3.0.0 upgrading to v3.0.1 receives the new `.act-protected.json`, the new `doc-hygiene.instructions.md` routing pointer, the `anti-hallucination` skill, and the terminology rename across 9 instructions/prompts. No `local/` overlay changes. `_registry.cjs` ownership unchanged. Marker `edition_version` rolls 3.0.0 → 3.0.1.

## [3.0.0] - 2026-05-27

**Major [behaviour] — structural consolidation and VERSION single-sourcing.**

### Changed

- **VERSION consolidation** — removed stale root `VERSION` file; canonical version is now solely `.github/VERSION`, read by `build-edition-manifest.cjs`, `bootstrap-heir.cjs`, and `upgrade-self.cjs`.
- **Manifest `edition_version`** updated from 2.6.0 to 3.0.0 (aligning with the v3.0.0 tag).
- **HANDOFF.md** removed (stale 2026-05-26 session context, superseded).

### Breaking

- Heirs or scripts that read a root-level `VERSION` file must update to read `.github/VERSION` instead.

## [2.6.0] - 2026-05-27

**Minor [behaviour] — heir discovery setup automation.** Fixes a silent-failure mode where Mall plugins installed under `.github/skills/local/<name>/` (the official path per `mall-installation.instructions.md`) were invisible to VS Code Copilot's chat surface because skill / prompt / agent discovery walks each registered root one level only, while instruction discovery recurses. Empirically verified on the `job` heir 2026-05-27 — adding the three `chat.*FilesLocations` workspace settings surfaced 18 previously-invisible local skills.

### Added

- **`.github/config/heir-workspace-settings-baseline.json`** — declarative baseline of the three VS Code workspace settings (`chat.agentSkillsLocations`, `chat.promptFilesLocations`, `chat.agentFilesLocations`) that register `.github/<type>/local/` as a second discovery root alongside `.github/<type>/`. Carries `$comment` block with full verification context and a falsifier deadline (2026-11-27 or sooner on any VS Code release that changes the settings contract). Registered as EDITION_OWNED in `_registry.cjs`.
- **`.github/scripts/shared/workspace-settings-merger.cjs`** — shared merger module that performs idempotent per-key deep-merge of the baseline into the heir's `.vscode/settings.json`. Strips JSONC `//` and `/* */` comments before parsing. Exports `mergeWorkspaceSettings(repoRoot, baselinePath)`, `writeMerged(result)`, `formatChangeSummary(result, verb)`. Separates compute from write so callers can dry-run.

### Changed

- **`bootstrap-heir.cjs`** — invokes the merger after the marker write (inside the existing APPLY-gated execute block). Fresh heirs receive the three discovery settings merged on top of the existing `.vscode/settings.json` template; all unrelated keys are preserved verbatim.
- **`upgrade-self.cjs`** — invokes the merger after step 5 (marker update). Existing heirs upgrading from any prior Edition version receive the three keys backfilled into their `.vscode/settings.json` on next `/upgrade`. Idempotent — subsequent upgrades report "Workspace settings: already current" with no changes.
- **`mall-installation.instructions.md`** — new `### Discovery setup` section at the top of `## Installation` documents the one-level discovery walk, the three settings keys with two-root maps, references the baseline + automatic merge, and provides a manual fallback for heirs on Edition < 2.6.0 (paste the keys directly, or run `scripts/apply-skill-discovery-settings.cjs --repo <heir-path>` from a sibling Supervisor checkout). `lastReviewed` bumped to 2026-05-27.
- **`build-edition-manifest.cjs`** — `EDITION_CONFIG_FILES` allowlist extended to include `heir-workspace-settings-baseline.json` so the manifest's `configs` array stays in sync with `_registry.cjs`. Manifest regenerated; `configs` count 3 → 4.

### Heir-visible behaviour delta

Per-key merge semantics: if a heir has previously set one of the three `chat.*FilesLocations` keys to a different shape (e.g. a scalar value or an array instead of an object), the merger will scalar-replace that value with the baseline object. Heirs who have customized these keys for non-default discovery roots should re-apply their customization after upgrade. Heirs who have not touched these keys (the expected majority) see only the three new keys appearing in `.vscode/settings.json` with no other change.

### Compatibility

Older VS Code (pre-1.118) silently ignores the three settings keys — the additions are backwards-compatible. Heirs on Edition < 2.6.0 can adopt the same fix manually using the documented fallback in `mall-installation.instructions.md`; no breakage if they do not upgrade.

## [2.5.0] - 2026-05-27

**Minor [behaviour] — baseline expansion + shared-core coherence.** Two new baseline skills adopted from MALL (debugging + security disciplines), VS Code 1.122 conveniences surfaced across the always-on instruction set, repository-wide EOL normalization (`.gitattributes`), and three shared-core instructions mirrored from Supervisor to close the gaps identified in the 2026-05-26 audit.

### Added

- **`systematic-debugging` skill** adopted from `MALL/obra-superpowers` — four-phase root-cause-first method (investigate → pattern-analyze → hypothesize → implement) with iron law "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST". Includes 3 supporting references (`root-cause-tracing.md`, `defense-in-depth.md`, `condition-based-waiting.md`). Closes a confirmed baseline gap — Edition had no debugging discipline; heirs defaulted to symptom-fixing.
- **`security-and-hardening` skill** adopted from `MALL/addyosmani-agent-skills` — OWASP-aware security-first practices with three-tier boundary system (Always Do / Ask First / Never Do), input validation patterns, secrets management, dependency-audit triage decision tree, security review checklist. Examples in TypeScript but principles are language-agnostic. Closes a confirmed baseline gap — Edition had zero security coverage; heirs handling input/auth/storage started without OWASP awareness.

### Changed

- **`tool-awareness` + `lint-discipline` instructions**: VS Code 1.122 conveniences (`/models` slash, BYOK air-gapped, local agent host watchpoint; "Search only in changed files" toggle for lint scope) surfaced as additive shortcuts. No rule changes.
- **`pii-memory-filter.instructions.md`**: added cross-link paragraph to `memory-triggers.instructions.md` § Memory Tier Selection clarifying that the filter constrains *what* may be written while MT constrains *where*. `lastReviewed` bumped to 2026-05-26. Mirrored from Supervisor (closes audit divergence).
- **`falsifiability-deadlines.instructions.md`**: dropped stale `/ muscle` from description after the `.github/muscles/` folder was collapsed into `.github/scripts/` in v2.4.0. `lastReviewed` bumped to 2026-05-26. Mirrored from Supervisor.
- **`severity-tagged-commits.instructions.md`**: added in-file `<!-- intentional divergence -->` marker documenting why the Edition variant differs from Supervisor's (heirs don't ship `ACT/**`; trigger list includes `.github/scripts/**`; brain-qa-changelog cross-ref is generalized). `lastReviewed` bumped to 2026-05-27. Closes audit Recommendation #3.
- **README**: skill count refreshed 30 → 32 after the two MALL adoptions.

### Infrastructure

- **`.gitattributes`** added with `* text=auto eol=lf` to normalize line endings across the repo. Required for stable EOL-normalized hashing in Supervisor's `shared-core-coherence-audit` skill. Pairs with Supervisor's matching `.gitattributes` (commit `a0e7e8e`).

## [2.4.0] - 2026-05-26

**Minor [behaviour] — substantial release**: per-type review/creator pairs (ADR-007), full Edition audit closing 39 findings, `.github/muscles/` folder collapsed into `.github/scripts/`, the 2026-05-26 cleanup pass (heir-facing docs validated, plugin guide removed, model table refreshed against GitHub Docs, `.github/config/` pruned, `.vscode/` workspace template established with curated CSS + 14-key settings), and `edition-manifest.json` extended to a complete file-level bill-of-materials (spec_version 1.0 → 1.3).

### Added

#### Skills + prompts

- **`deep-review` skill** mirrored from Supervisor — adversarial code review with three parallel perspectives (Advocate, Skeptic, Architect). Complements single-pass `code-review` for high-stakes PRs.
- **3 baseline skills mirrored from Supervisor**: `code-review`, `git-workflow`, `status-reporting`. Each with always-on routing instruction. Closes a real heir-baseline gap.
- **6 per-type review/creator pair skills**: `instruction-review`/`instruction-creator`, `prompt-review`/`prompt-creator`, `agent-review`/`agent-creator` (per ADR-007). Heirs gain Supervisor's curation surface.
- **3 new slash-prompts**: `/review-instruction`, `/review-prompt`, `/review-agent` — complete four-way symmetry with the existing `/review-skill`.
- **`doc-hygiene` skill** mirrored from Supervisor (anti-drift rules, link integrity, count elimination, living-document maintenance).
- **`markdown-mermaid/references/mermaid-reference.md`** (1339 lines) — deep-dive content extracted from SKILL.md (diagram tool selection, palette + theming, parser pitfalls, audit methodology, quality checklist).

#### Workspace environment + user settings

- **`.vscode/markdown-light.css`** (edition-owned) — Mermaid-friendly markdown preview theme shipped directly. Replaces the prior copy-via-prompt workflow.
- **`.vscode/settings.json`** (heir-owned bootstrap template, 14 keys) — wires `markdown.styles` at the new CSS, ships recommended Mermaid theme defaults (matches `/polish-mermaid-setup` Step 3), markdown-scoped editor settings (preserves two-space line breaks, wordWrap on, prose suggestions on), file hygiene (`insertFinalNewline`, `trimFinalNewlines`), sensible markdown preview defaults. Preserved across `/upgrade`.
- **`welcome-baseline.json` gains 3 user-scope keys**:
  - `github.copilot.chat.skillTool.enabled: true` — load-bearing per `tool-awareness.instructions.md`; default `true`, explicit lock prevents drift across VS Code versions.
  - `claudeAgent.allowAutoPermissions: false` and `claudeAgent.allowDangerouslySkipPermissions: false` — defensive locks against VS Code 1.121's Claude Agent preview "Auto" mode and "Bypass all permissions" / YOLO mode. ACT's permission discipline is non-negotiable.
  - `$comment` refreshed to 8 categories with REQUIRED markers so future audits can distinguish load-bearing from UX-only settings.

### Changed

#### Brain artifacts

- **22 prompts stripped deprecated `mode: agent` frontmatter** — deprecated and ignored per current Microsoft Learn prompt-files spec.
- **23 prompts gain `## Would Revise If`** + `lastReviewed: 2026-05-26` (20 from the broad sweep + 3 thin alias prompts via inline `**Would revise if**` text: `checkin`, `meditate`, `note`).
- **3 converter skills gain `## Would Revise If`** — `html-to-md`, `markdown-sanitization-chain`, `md-to-txt`. 90-day windows with specific trigger conditions.
- **8 always-on shared-core instructions mirrored byte-identical with Supervisor**: `act-foundations`, `act-pass`, `critical-thinking`, `epistemic-calibration`, `privacy-responsible-ai`, `proactive-awareness`, `system-prompt-skepticism`, `falsifiability-deadlines`. Vague "would revise if" sections replaced with concrete 90-day falsifier windows (2026-08-26).
- **4 worker agents tightened against Gate 6 (Tool Allowlist Minimality)** — byte-identical mirror with Supervisor. `document-assembler` drops unused `search/codebase`; `illustrator` trims to `read`-only; `markdown-author` drops `search/*` + `search/usages`. `brain-auditor` retains `edit`.
- **`markdown-mermaid` SKILL.md trimmed 1648 → 327 lines** (80% reduction) by extracting reference content to `references/mermaid-reference.md`. SKILL.md keeps the operational core (init template, ATACCU workflow, mode fragility). Description rewritten from slogan to what+when discovery aid.

#### Heir-facing docs + workspace assets

- **`markdown-light.css` moved to `.vscode/`** (was `.github/skills/markdown-mermaid/markdown-light.css`). Edition-owned per `sync-policy.json` (18 → 19 paths). Replaces the manual copy-via-prompt workflow; `/polish-mermaid-setup` Step 4 simplified accordingly.
- **`README.md` revised** — instructions list aligned with actual brain (36 instructions across 6 cleaner categories; dropped 6 phantoms `alternatives-and-tradeoffs`/`partnership-charter`/`technical-writing`/`creative-loop`/`debugging`/`scope-management`; added 8 missing real ones `agent-delegation`/`code-review`/`falsifiability-deadlines`/`git-workflow`/`no-deferred-debt`/`severity-tagged-commits`/`status-reporting`/`tool-awareness-categories`). Path-count contradiction fixed ("Three entry paths"). Two redundant Mall subsections consolidated. Practical Recommendation aligned with the model table.
- **Model table validated against [GitHub Docs Supported AI models](https://docs.github.com/en/copilot/reference/ai-models/supported-models)** — removed 5 (GPT-4o utility-only; 4 Microsoft-internal Claude variants); added 4 (Claude Opus 4.6 fast-mode preview, Gemini 3.5 Flash GA, Raptor mini, Goldeneye). Multiplier callouts inlined (30x, 14x, 7.5x). Snapshot date refreshed 2026-05-19 → validated 2026-05-26. `GPT-5.4 nano` deliberately not added (Codex VS Code only per GitHub Docs footnote).
- **`.github/config/README.md` rewritten** — ownership table shows only files that actually exist + a "Read by" column for at-a-glance consumer visibility.

### Fixed

- **`init-edition.cjs` heir-doctor path** — bootstrap step 3 referenced `.github/muscles/heir-doctor.cjs` (no longer exists after the muscles → scripts collapse). Corrected to `.github/skills/greeting-checkin/scripts/heir-doctor.cjs`. Fresh inits now actually run heir-doctor instead of silently skipping it.

### Removed

#### Brain artifacts

- **`.github/muscles/` folder** — brain-executable tier collapsed into `.github/scripts/` after per-skill consolidation drained it of skill-bound content. Cross-cutting executables (`converter-qa.cjs`, `audit-mall-drift.cjs`) and shared library moved to `scripts/`. Heir Mall-install destination migrated from `.github/muscles/local/**` to `.github/scripts/local/**`.
- **`academic-paper-drafting` skill** — semantic review found 683 lines (over skill-review Gate 2's 500-line cap). User chose removal over trim or accept-exception (reversed the earlier "keep" decision after the size violation surfaced). Mall plugin or `.github/local/skills/` for heirs that need it.
- **`/migrate-from-alex-master` slash-prompt** — fleet completed AlexMaster → ACT Edition migration months ago. Historical tooling whose continued presence implied active migration support.
- **`audit-apis` workflow** — `.github/EXTERNAL-API-REGISTRY.md` + `.github/prompts/audit-apis.prompt.md` + (already-removed) `.github/muscles/audit-api-drift.cjs`. Low-yield: registry stayed stale; drift detector flagged dates not source-of-truth changes; semantic audit fell back on model knowledge anyway. Heirs that want it can install a Mall plugin or maintain their own under `.github/local/`.

#### Heir-facing docs + dead config

- **`PLUGINS.md` + `assets/banner-plugins.svg`** — Fabio-specific plugin-registration guide hardcoding paths into Microsoft-internal `.github-private` stores most heirs cannot clone (9 of 12 plugins). Operator content, not heir baseline. Banner was orphan after the doc deletion.
- **`scripts/` folder (root)** — contained only `cleanup-frontmatter.cjs`, a one-shot from today's frontmatter sweep (`997c6d6`). Violates the `.github/`-namespace rule (`c2764df`).
- **`.github/config/markdown-light.css`** (21KB fossil) — duplicate of the canonical skill-bundled copy with divergent content. Zero functional consumers; superseded by the `.vscode/markdown-light.css` shipment.
- **`.github/config/mcp.json.template`** — zero functional consumers; documented "copy to `.vscode/mcp.json`" workflow was never wired. Heirs that want MCP servers can author `.vscode/mcp.json` directly.
- **`mermaid-chat.enabled: true`** from `welcome-baseline.json` — dead setting; no marketplace extension publishes it. VS Code 1.121+ ships Mermaid Markdown Features built-in with no setting required.

### Architecture

- **4-artifact-type brain (was 5)** — with `muscles/` gone, the brain lexicon now describes 4 artifact types (skills/instructions/prompts/agents) plus an executable tier (`.github/scripts/`). Reflected in `copilot-instructions.md`, `severity-tagged-commits.instructions.md`, `meditation.instructions.md` + skill, `falsifiability-deadlines.instructions.md`, `skill-creator/SKILL.md` routing tables, `welcome.prompt.md` brain-inventory line, and `README.md` (header counts, What Else Ships, Customization Slots, Vocabulary).
- **Architecture-table refresh in `copilot-instructions.md`** — cluster table now accurately lists only artifacts that actually ship (was naming 7 instructions deleted in the 2026-05-18 consolidation, violating Tenet III). 11 clusters covering the actual brain shape.
- **6 converter skills strip legacy `muscle:` frontmatter field** (no consumer; documentation-only field that drifted).
- **`creative-writing` skill description** rewritten from generic prose to what+when format.
- **`md-to-eml` SKILL.md** drops "graveyard" prose section that fossilized prior design discussion.
- **`md-to-txt` SKILL.md** fixes double-dash typo in section header.

### Internal

- **Audit method**: 4 parallel subagent audits (skill-review, instruction-review, prompt-review, agent-review per ADR-007) surfaced 39 Revise findings across 27 skills / 33 instructions / 28 prompts / 4 agents. All 39 resolved in 5 fix batches.
- **Tier C decisions** (judgment per Supervisor precedent): `act-foundations` + `memory-triggers` Gate 6 overages ACCEPTED as framework exception; `falsifiability-deadlines` Edition scope KEPT (heirs DO author brain artifacts when extending baseline).
- **brain-qa Edition findings**: 0 after every batch. SHA-256 byte-identity verified on all mirrored artifacts.
- **`edition-manifest.json` spec_version bumped 1.0 → 1.3** — manifest is now the file-level bill-of-materials. 1.1 added `instructions` (36), `scripts` (15 incl. shared/), `copilot_instructions`, `configs` (3), `version_file`, `vscode_assets` (1). 1.2 added `bootstrap_templates` (2: `.vscode/settings.json` + `.github/config/cognitive-config.json`) — HEIR_OWNED files Edition ships as first-install templates, sourced live from `HEIR_OWNED` in `_registry.cjs` so no drift. 1.3 added `skill_files` (50) — recursive file enumeration under every skill directory (SKILL.md + scripts/ + references/ + assets/ + sub-prompts). `skills` retained at unit granularity for heir-doctor drift detection. Additive at every step: existing consumers reading older fields work unchanged; `heir-doctor.cjs` verified still healthy. Strict file-by-file audit: 139 files in `.github/` + `.vscode/`, 139 enumerated by manifest, 0 untracked, 0 phantom.

## [2.3.0] - 2026-05-25

**Minor [behaviour] — init UX unified across CLI, README, and Extension; `/welcome` rebuilt as a true orientation tour.** Three previously divergent post-bootstrap paths now hand the user the same next-step checklist, and the `/welcome` slash-command finally matches its name. Heirs auto-update via `node .github/scripts/upgrade-self.cjs`; no `--allow-major` required.

### Changed

- **`/welcome` rebuilt as a read-only orientation tour.** Previously, `/welcome` applied baseline VS Code user-scope settings — useful, but mis-named and surprising on first run. The settings logic moved to a new `/configure-vscode` command (verbatim port, no behavior change). The new `/welcome` is read-only: identity summary from `.act-heir.json` + `copilot-instructions.local.md`, three always-on capabilities worth knowing, Mall discovery, three good first-prompt examples, and where to go next. No writes.
- **Post-bootstrap next-step block is now shared across all three init paths** (CLI `init-edition.cjs`, README Quick Start, Extension toast — Extension portion lands in the next Extension release). All three render the same checklist: edit `copilot-instructions.local.md` first, then `/welcome`, then `/configure-vscode`, then start a real chat. Removes the previous mismatch where the CLI suggested customizing identity *after* `/welcome` but the README didn't mention it at all.
- **README Quick Start expanded.** Top-of-file gains a 3-line happy-path block for skimmers; the main Quick Start section now enumerates four entry paths (CLI, /initialize, Marketplace extension, after-bootstrap checklist) instead of one. Adds an explicit pointer to fill in `## Project Context` before the first chat — identity grounding from session 1 beats session 10.
- **`heir-doctor.cjs`** warning text for missing `copilot-instructions.local.md` updated to point at the new `/welcome` for guided orientation rather than the renamed settings command.

### Added

- **`.github/prompts/configure-vscode.prompt.md`** — applies baseline VS Code user-scope settings for fleet policy compliance. Identical behavior to the prior `/welcome` (loads from `.github/config/welcome-baseline.json`, which keeps its filename for backward compatibility).
- **`.github/prompts/configure-vscode-verify.prompt.md`** — read-only audit of user-scope VS Code settings against the central baseline. Identical behavior to the prior `/welcome-verify`.

### Removed

- **`.github/prompts/welcome-verify.prompt.md`** — renamed to `configure-vscode-verify.prompt.md`. Heirs that bookmarked `/welcome-verify` should switch to `/configure-vscode-verify`; no aliasing layer ships (Edition slash-commands are read directly by the VS Code chat surface, so deprecation aliases would require shipping a stub-prompt which is itself friction).

### Migration notes for heirs

Run `node .github/scripts/upgrade-self.cjs`. The upgrade copies the two new `configure-vscode*.prompt.md` files, overwrites `welcome.prompt.md` with the new orientation tour content (Edition-owned, safe), and deletes the old `welcome-verify.prompt.md`. If you wrote local overrides of `welcome.prompt.md`, move them to `.github/prompts/local/` before upgrading or they'll be replaced.

### Upgrade command

```pwsh
node .github/scripts/upgrade-self.cjs
```

`Bump: minor · Breaks: none (one command renamed, behaviour preserved) · Deprecated: /welcome-verify (use /configure-vscode-verify) · Removed: welcome-verify.prompt.md`

## [2.2.1] - 2026-05-25

**Patch — version bump only, no artifact changes.** Cuts a new Edition release so the heir-side `upgrade-self.cjs` flow can be exercised end-to-end against a real version delta. No skills, instructions, prompts, agents, muscles, or config schemas changed since 2.2.0. Extension/overall surface remains at v9.0.0 (unchanged).

### Upgrade command

```pwsh
node .github/scripts/upgrade-self.cjs
```

`Bump: patch · Breaks: none · Deprecated: none · Removed: none`

## [2.2.0] - 2026-05-24

**Minor — adds one always-on rule (`no-deferred-debt`), removes 6 always-on instructions that were not earning their tokens, retires heir migration tooling, and documents VS Code 1.118+ skill picker surfacing in `tool-awareness`.** Net effect: leaner always-on set with sharper firing patterns. Heirs auto-update via `node .github/scripts/upgrade-self.cjs`; no `--allow-major` required.

### Added

- **`.github/instructions/no-deferred-debt.instructions.md`** — always-on rule: when a turn surfaces tech debt, dead links, stale references, or outdated content, fix it in the same turn. Composes with `lint-discipline` (which covers files I touched) by covering debt I surfaced regardless of authorship. Lifted from Alyva_Master heir-side discipline and adopted as Supervisor + Edition shared-core per FOUR-REPOS-COMPARISON.md Tier A §0.1 row 3. Lifecycle `provisional`; self-falsified at 10 opportunity-turns or 2026-08-23.

### Changed

- **`.github/instructions/tool-awareness.instructions.md`** — new section documenting VS Code 1.118+ skill picker surfacing (`.github/skills/<name>/SKILL.md` files with non-empty `description` now appear in the chat slash-command picker alongside prompts). Explains the verb-prompt / noun-skill pairing is intentional and the lever (`github.copilot.chat.skillTool.enabled`) is user-scoped, not a brain defect. Falsifier: revise by 2026-08-24 or sooner on first observed contradiction.

### Removed

- **6 always-on instructions that were not earning their tokens** — `debugging.instructions.md`, `creative-loop.instructions.md`, `partnership-charter.instructions.md`, `alternatives-and-tradeoffs.instructions.md`, `scope-management.instructions.md`, `technical-writing.instructions.md`. Removal rationale: zero or near-zero cross-references in heir-facing brain; broad `applyTo` patterns firing on common conversational words (debug/build/scope/option/doc) for content already covered by stronger files (`critical-thinking` + Two-Hypothesis Floor, `act-pass` Step 3 Alternatives, `problem-framing-audit` root-cause reframe, `no-deferred-debt`, `lint-discipline`, `communication-craft`, `markdown-mermaid`, `ai-writing-avoidance`). Each removal was approved file-by-file by user after audit; mirror-deleted from Supervisor as canonical source.
- **`migrate-to-edition.cjs` + `MIGRATION.md` + `.github/prompts/finalize-migration.prompt.md`** — heir migration tooling for moving pre-Edition Alex heirs to Edition. Fleet inventory shows all heirs on Edition v1.x+ for months; the migration path is historical. `init-edition.cjs` remains as the path for new heirs. Cross-refs cleaned up in `README.md`, `init-edition.cjs`, `.github/muscles/heir-doctor.cjs` (template-detector signal simplified to require only `init-edition.cjs`), `.github/config/edition-manifest.json`, `.github/prompts/checkin.prompt.md`, `.github/prompts/initialize.prompt.md`.

### Why this matters

Token economy and signal-to-noise. The 6 removed instructions averaged ~4KB each with broad `applyTo` patterns that fired on common project-conversation words. Their content was generic ("be hypothesis-driven", "consider alternatives", "manage scope") and covered by load-bearing rules elsewhere in the brain. Removing them sharpens what loads when. The migration tooling removal cuts ~40KB of heir-template payload that no longer corresponds to a live use case.

### Upgrade command

```pwsh
node .github/scripts/upgrade-self.cjs
```

### Gates verified

| Gate | Result |
| --- | --- |
| Supervisor `brain-qa.cjs` | exit 0, 0 hard failures, 0 stale of 132 files |
| Edition `test-edition-applyto-coverage.cjs` | 18/18 PASS, 0 capability gaps |

---

## [2.1.0] - 2026-05-24

**Minor — two new always-on instructions for severity-tagged brain commits and falsifiability deadlines.** Lifted from Karpathy_Loop's Phase 3 operational discipline (2026-05-23) and adopted as fleet-wide always-on per [Supervisor brain-qa proposal 2026-05-24-02](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/docs/proposals/brain-qa-2026-05-24-02.md). These two rules sit underneath the existing brain-curation flow as additional gates — they don't replace the proposal-first protocol, they tighten it.

`[constitutional]` change: both new instructions are rules other rules now depend on. `brain-curation-rules` (Supervisor only) gained a Severity + Falsifiability Gate subsection that references both.

### Added

- **`.github/instructions/severity-tagged-commits.instructions.md`** — every brain-touching commit must carry one of `[typo | clarification | behaviour | constitutional]` in the subject line. `[behaviour]` requires the trimmed ACT pass; `[constitutional]` requires the full pass. Mixed commits get the highest tier. Self-falsified at 30 brain-touching commits or 2026-08-23, whichever fires first.
- **`.github/instructions/falsifiability-deadlines.instructions.md`** — every new or materially edited brain artefact (instruction / skill / prompt / muscle / agent) must declare a specific falsification deadline: date, event, or count+time. "After N passes" without a date is not sufficient. Two-step lifecycle transition `provisional → sinking → archived`. Self-falsified at 5 new artefacts adopting deadlines or 2026-08-23, whichever fires first.

### Why this matters

Severity tags restore credit-assignment fidelity that flat commit lists destroy — a typo fix and a Cardinal Rule change had identical weight in `git log` before. Falsifiability deadlines prevent provisional artefacts from accumulating in the brain indefinitely while their authors hope future evidence will materialise. Both disciplines proved operational in Karpathy_Loop (a live daughter heir) over the prior 24 hours; this release promotes them to the fleet baseline.

### Upgrade command

```pwsh
node .github/scripts/upgrade-self.cjs
```

No `--allow-major` needed. The new instructions activate automatically — they apply to all commits and all new artefacts going forward, not retroactively.

### Gates verified

| Gate | Result |
| --- | --- |
| Supervisor `brain-qa.cjs` | exit 0, 0 stale of 139 files |
| Supervisor `test-applyto-coverage.cjs` | 15/15 PASS, 0 capability gaps |
| Supervisor always-on set | 17 files, 16,760 tokens (was 16 files, ~16,000 tokens — +760 net) |
| Edition `test-edition-applyto-coverage.cjs` | 18/18 PASS, 0 capability gaps |

### References

- Karpathy_Loop sources: `local/severity-tagged-commits.instructions.md`, `local/add-falsifiability-deadlines.instructions.md`
- Supervisor commit: `[constitutional]` tag on the shipping commit
- Tracker: FOUR-REPOS-COMPARISON.md §0.1 Tier A rows 1 + 2 → status "shipped (Edition v2.1.0)"

---

## [2.0.5] - 2026-05-21

**Patch — 25 shared-core brain files gain `## Would Revise If` falsifier sections.** Mirror of Supervisor D2(a) commit `c6327bb`. Each WRI names specific failure modes that would invalidate the file's advice — not boilerplate. Brain epistemic-qa coverage rises 45.5% → ~91% in Edition. No behavioral change for heirs: the files still direct the same actions; the WRI is an epistemic addition that names the conditions under which each rule should be revisited.

Closes the C1 falsifiability gap identified in [Supervisor brain-qa 2026-05-21 findings](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/docs/proposals/brain-qa-2026-05-21.md) (decision D2 option a, both phases). Satisfies the Cardinal Rule 3 quarterly CT-trifecta refinement requirement for Q2 2026 — the four CT-trifecta files (critical-thinking instruction + skill, problem-framing-audit, system-prompt-skepticism) are among the 25 with file-specific WRIs.

### Added

- **`## Would Revise If` section in 23 always-on instructions** — act-foundations, ai-writing-avoidance, alternatives-and-tradeoffs, brain-audit, communication-craft, creative-loop, critical-thinking, emotional-intelligence, epistemic-calibration, knowledge-coverage, lint-discipline, markdown-mermaid, partnership-charter, pii-memory-filter, privacy-responsible-ai, proactive-awareness, problem-framing-audit, reliance-nudges, scope-management, session-health-monitoring, system-prompt-skepticism, tool-awareness, tool-awareness-categories
- **`## Would Revise If` section in `skills/critical-thinking/SKILL.md`** — covers the 7 disciplines + Discipline -1 frame audit
- **`## Would Revise If` section in `skills/markdown-mermaid/polish-mermaid-setup.prompt.md`** — falsifier for the workflow prompt

### Verification

- `brain-qa.cjs`: exit 0, 0 stale of 137 files
- `epistemic-qa.cjs` (Edition): 100/100 score, warns 4 → 3 (the `critical-thinking/SKILL.md` mirror brought along Supervisor's D1 OVR01 reword fix)
- `test-edition-applyto-coverage.cjs`: 18/18 PASS, 0 capability gaps
- `coherence-check.cjs`: 0 hard, 0 soft

### Upgrade

```pwsh
node .github/scripts/upgrade-self.cjs
```

No `--allow-major` needed. No `/welcome` re-run needed. WRI sections are additive content; existing heir behavior unchanged.

---

## [2.0.4] - 2026-05-19

**Patch — README Model Compatibility section gains the Copilot Language Models spec snapshot.** Adds the factual model surface (context window, capability flags, in/out/cache costs) visible in VS Code 1.121's Language Models view (`Settings → GitHub Copilot → Language Models`). Documentation-only patch; no brain behavior change.

### Added

- **`README.md` — Model Compatibility § "Snapshot: Copilot Language Models (2026-05-19)"** — 22-row table covering every Copilot model in the VS Code 1.121 picker:
  - Context window (range: 68K → 1M)
  - Tools and Vision capability flags (universal across the lineup — not differentiators)
  - Input / output / cache cost in credits per 1M tokens (range: In 25–500, Out 200–3000, Cache 2.5–125)
  - Retirement warnings for GPT-4.1, GPT-5.2, GPT-5.2-Codex (all closing 2026-06-01)
- One-paragraph framing below the table noting what is **universal** (Tools + Vision present everywhere) vs what is **variable** (context, in/out/cache cost), and pointing at the capability-floor benchmark (`MAN.8.3`) as the deferred work that will turn this spec sheet into an ACT-fit recommendation.

### Notes for heirs

- **Verify against your own Language Models view** before depending on these values. Model availability and pricing can change between releases.
- Costs are **credits per 1M tokens** (Copilot internal accounting) — different from the *premium request multiplier* surface documented at `docs.github.com/copilot/reference/ai-models/supported-models`. Both surfaces matter; this snapshot covers the credits view.
- The table is **factual spec data, not a recommendation**. The v2.0.3 architectural-needs framing in the same section is still the active recommendation. Measured ACT-discipline floor remains the open `MAN.8.3` question.

### Heir impact

Documentation-only. No `/upgrade` reconfiguration needed.

### Audit trail

- Companion to v2.0.3 README guidance (`10bbe2e`)
- Supervisor `README.md` updated in parallel with identical table (single source of truth across both repos)
- Source: VS Code 1.121 Language Models settings view, screenshot dated 2026-05-19
- Cross-referenced against GitHub Docs `supported-models` page for retirement dates and plan availability
- `test-edition-applyto-coverage`: 18/18 PASS (unaffected — no brain-file changes)
- `brain-qa`: exit 0 (79 + 58 files)

---

## [2.0.3] - 2026-05-19

**Patch — README gains an honest Model Compatibility section.** Adds explicit guidance for heirs about which Copilot models the brain is known to work with, what architectural needs the brain has, and what we have **not** measured. Closes a documentation gap; does not change any brain behavior or settings.

### Added

- **`README.md`** — new top-level section **Model Compatibility** between the cognitive-architecture intro and the Commands table. Contents:
  - Explicit "we have not characterised the minimum model" disclaimer citing `MAN.8.3` in the Claims Registry
  - What we tested with: Claude Opus 4.7 (1M context) for v1.5.0 reasoning baseline + v2.0.0 release benchmark
  - Architectural needs: tool calling, long context (≥ 64K, ideally ≥ 128K), instruction adherence, multi-step reasoning
  - Practical recommendation: reasoning-class models (Claude Sonnet 4+, Claude Opus, GPT-4.1, GPT-4o or equivalent) for primary agent work; `gpt-4o-mini` reserved for the `chat.utilityModel` / `chat.utilitySmallModel` slots per v2.0.2 baseline (NOT for primary agent work)
  - Open question: call for heir feedback with reports of "this worked on X" / "this failed on Y" routed to `AI-Memory/feedback/alex-act/`

### Heir impact

Documentation-only. No behavior change. Heirs on v2.0.2 reading the new section will learn what model class is recommended; no `/upgrade` reconfiguration is needed beyond pulling the new README.

### What this is not

This release does **not** establish a measured minimum model. The `MAN.8.3` claim remains open. The architectural-needs framing is the honest current state. A planned capability-floor benchmark (tracked in Supervisor `HANDOFF.md` outstanding item #8) will replace this guidance with measured floor on a future Edition release.

### Audit trail

- Companion to v2.0.2 baseline (`178cb76`) and v2.0.1 brain rules (`f9aaffd`)
- Supervisor README updated in parallel with curator-facing framing
- Provenance: user directed 2026-05-19 evening "A and then another day we refine it with B" — this is Option A (ship honest architectural-needs guidance now); Option B (run capability-floor benchmark to close `MAN.8.3`) deferred to a future session
- `test-edition-applyto-coverage`: 18/18 PASS (unaffected — no `applyTo` or brain-file changes)

---

## [2.0.2] - 2026-05-19

**Patch — welcome baseline gains three VS Code 1.120/1.121 settings.** Three keys added to `.github/config/welcome-baseline.json` so all heirs get them on next `/welcome` (or fresh setup). Companion to v2.0.1 (which updated the brain rules describing these capabilities); v2.0.2 wires the matching settings into the heir bootstrap.

### Changed

- **`.github/config/welcome-baseline.json`** — added three keys to the `settings` object:
  - `chat.tools.compressOutput.enabled: true` (1.120 Preview) — enables terminal output compression for `git diff` / `ls -l` / `npm install` and the 1.121 expansion (test runners, build tools, linters, Docker, package managers). The brain's file-redirect fallback remains valid for cases where compression strips data the agent needs.
  - `chat.utilityModel: "gpt-4o-mini"` (1.121) — routes title generation, rename suggestions, and settings search to a smaller cheap model. Heirs can override locally if `gpt-4o-mini` isn't in their model surface (VS Code falls back to default).
  - `chat.utilitySmallModel: "gpt-4o-mini"` (1.121) — same rationale for the small-model slot.
- **Baseline `$comment`** updated to acknowledge that preview/experimental toggles can be included when explicitly requested by user policy and noted in CHANGELOG (was: "Stable settings only — keep preview/experimental toggles off unless explicitly requested"). `chat.tools.compressOutput.enabled` is the first such inclusion.

### Heir impact

Heirs running `/welcome` (first-session bootstrap or new-machine setup) get all three settings. Heirs running `/welcome-verify` will see the three keys flagged as `missing` until they re-run `/welcome`. Existing user-level overrides for these keys are preserved by the merge step in `/welcome` (it merges, doesn't overwrite values that already differ — well, actually it does overwrite to match baseline; heirs who want a different utility model should set it AFTER `/welcome`). No `--allow-major` needed; standard `/upgrade` covers the baseline file.

### Override guidance

Heirs who want a different utility model (e.g. running on BYOK with a different small-model name) should set their override in personal `settings.json` AFTER running `/welcome`. The `/welcome` merge is overwrite-to-baseline, so the override needs to be re-applied if `/welcome` runs again.

### Validation

Dogfooded the `/welcome` reference command (verbatim from `welcome.prompt.md`) against the curator's personal `settings.json` before shipping — all three keys landed correctly as JSON booleans/strings (lowercase `true`, quoted model names). No existing keys disturbed.

### Audit trail

- Companion to v2.0.1 (brain rules) — commits `b6dafc3` (Supervisor) + `f9aaffd` (Edition)
- Proposal: original `vscode-1.120-1.121-adoption-2026-05-19.md` recommended these as personal-settings-only; user directed (2026-05-19) to bake into the heir baseline instead
- Brain-qa: exit 0 across 79 Supervisor + 58 Edition files (no brain file changes in v2.0.2)
- `test-edition-applyto-coverage`: 18/18 PASS, 0 capability gaps (no `applyTo` changes)

---

## [2.0.1] - 2026-05-19

**Patch — VS Code 1.120/1.121 feature adoption.** Three brain files updated to reflect VS Code capabilities that shipped between 2026-05-13 and 2026-05-19. Mirrored byte-for-byte from Supervisor per the shared-core direction-of-edit rule. Zero behavior change for heirs — additive informational text + one factual correction + one extension-recommendation update.

### Changed

- **`terminal-command-safety.instructions.md`** — documents two new VS Code mechanisms that work alongside the existing rules:
  - NEW section *VS Code 1.120 + 1.121 Terminal Output Compression (Preview)* names `chat.tools.compressOutput.enabled` and the 1.121 expansion to `pytest` / `jest` / `cargo test` / `tsc` / `cargo build` / `make` / linters / Docker / package managers, plus auto-dispose of background terminals.
  - *Terminal Hanging* rule #1 now notes that VS Code 1.121+ auto-promotes sync→background after a configurable idle-silence period; the agent-intent rule remains correct and is still required on older builds.
  - *Falsifier — Backtick Hazard* watermark bumped from "through 1.118" to "through 1.121" with note that 1.120/1.121 ship no fix for `microsoft/vscode#295620`. The temp-file pattern remains mandatory.
- **`session-health-monitoring.instructions.md`** — *Proxy Heuristics* opener corrected: VS Code 1.120 made BYOK token counts visible in the Chat-view context-window control. Opener now distinguishes BYOK (ground truth available) from non-BYOK / older builds (proxy heuristics still apply). Table below unchanged.
- **`markdown-mermaid/SKILL.md`** — *VS Code Extension Setup* updated: VS Code 1.121 ships built-in Mermaid rendering in Markdown previews per `microsoft/vscode#293028`. Recommendation list keeps mermaidchart (chart authoring), vstirbu (standalone preview tab), and non-Mermaid tools (PlantUML, Graphviz, D2). `bierner.markdown-mermaid` removed — the built-in renderer covers its use case.

### Out of scope (deliberate)

Three 1.120/1.121 features documented in the proposal but **not adopted** pending field data: `chat.tools.riskAssessment.enabled` (overlaps act-pass severity), Claude auto-permission mode (overlaps act-pass), and workspace-level forcing of `chat.tools.compressOutput.enabled` (still preview).

### Heir impact

None for the contract. Heirs on v2.0.0 reading the updated rules gain awareness of upstream-handled mechanisms; the rules themselves continue to fire correctly. No `--allow-major` needed; standard `/upgrade` covers it.

### Proposal + audit trail

- Proposal: `Alex_ACT_Supervisor/docs/proposals/vscode-1.120-1.121-adoption-2026-05-19.md`
- Supervisor commit: `b6dafc3` (origin/main)
- Brain-qa: exit 0 across 79 Supervisor + 58 Edition files
- `test-applyto-coverage`: 15/15 PASS, 0 capability gaps
- `test-edition-applyto-coverage`: 18/18 PASS, 0 capability gaps

---

## [2.0.0] - 2026-05-19

**Major — reasoning-quality release.** Same brain shape (36 instructions, 18 skills, 23 prompts, 16 muscles, 4 agents), same heir API surface, same `/upgrade` mechanism. Behavior changes are improvements to always-on reasoning disciplines that close measured coverage gaps in benchmark scenarios while reducing total credits-per-solved-problem. Major version bump signals that heirs upgrade via `--allow-major` and acknowledges that v2 reasoning IS measurably different from v1.5.0 (sharper verify-before-report, frame audits on explain frames, output-discipline gates).

Validated by:

- Compose verification benchmark (5 scenarios): **13/15 → 15/15 composite**, **-22.5% credits** (228.5 → 177.0)
- S360 real-world adoption: heir adopted on `main` 2026-05-19 and self-promoted `.act-heir.json` from `2.0.0-candidate` → `2.0.0` after multi-commit follow-through validation
- Tenet X demonstration in S360: v2 brain refused a stale templated instruction from Supervisor (exactly the failure mode the new rules were designed to catch)
- Terminal-safety fix empirical validation: 3 post-fix commits in S360 with `$env:TEMP` pattern, zero `.commit-msg.tmp` leaks (verified via `git show --stat`)

### Breaking

- **None for the heir contract.** File inventory unchanged. Heir-side `.act-heir.json`, scripts, `local/` skills, `HANDOFF.md`, `episodic/`, `workflows/` all preserved on upgrade.
- **Behavior changes are intentional** and visible: heirs will notice more verify-before-report patterns firing on search/summary work, more explicit frame-audit markers on "explain X" / "tell me how Y works" prompts, more by-name citations during disagreement-mode refusals. Net effect per benchmark + S360: better outcomes at lower cost, but takes a session to feel natural.
- **`--allow-major` required** on `node .github/scripts/upgrade-self.cjs` for heirs upgrading from any v1.x to v2.0.0.

### Added

- **`epistemic-calibration.instructions.md` Output-discipline subsection** (Phase 3.3) — Anti-Hallucination Signals table split into Input-discipline (existing 5 rows: claims about generation) and Output-discipline (3 new rows: claims about reporting):
  - `"No matches found"` / `"Verified clean"` / `"Nothing returned"` → verify search scope before reporting absence; cite paths/globs/file-count
  - `"The doc says X"` / `"Per README"` / `"According to spec"` → cross-check doc against filesystem; cite both
  - `"I checked and..."` / `"Verified that..."` → name what was actually checked; unattributed verification is theatre
  - Plus 4th Core Principle: *"A search that didn't run looks identical to a search that found nothing — verify the scope before reporting absence."*
- **`problem-framing-audit.instructions.md` Explain/Summarize Frame subsection** (Phase 5 Option C) — complementary discipline for summarization patterns the Output-discipline literal triggers don't catch:
  - Literal trigger phrases: `"Explain X"`, `"Tell me how Y works"`, `"Describe Z"`, `"Summarize <doc>"`, `"Read <file> and..."`, `"Walk me through..."`, `"What does <doc> say about..."`
  - Required action: name source file(s) read + cross-check ≥1 structural claim against filesystem; if doc and filesystem disagree, surface the gap and report both
  - Visible marker: `**Verified against**: <doc path> + <filesystem check>`
- **`terminal-command-safety.instructions.md` temp-file location guidance** — closes a heir-reported defect (the `git commit -F tmpfile` + `git add -A` interaction silently committed temp message files into commits):
  - Warning paragraph: place temp files outside the working tree (`$env:TEMP\<slug>.txt` on Windows, `/tmp/<slug>.txt` on Unix) OR add the pattern to `.gitignore` before staging
  - Preferred PowerShell template using `Join-Path $env:TEMP` + `Set-Content -NoNewline` + `git commit -F` + `Remove-Item`

### Changed

- **3 instruction files** updated (see Added above for the substantive changes):
  - `.github/instructions/epistemic-calibration.instructions.md`
  - `.github/instructions/problem-framing-audit.instructions.md`
  - `.github/instructions/terminal-command-safety.instructions.md`
- **`.github/VERSION`** bumped 1.5.0 → 2.0.0.
- **File inventory unchanged** at 36 instructions / 18 skills / 23 prompts / 16 muscles / 4 agents.
- **Always-on token growth: ~+908 tokens/session** (~+3632 bytes across the 3 instruction files). Trade is net-positive per benchmark: -22.5% credits across the 5-scenario Compose set; breakeven at ~1 avoided corrective turn per 10 sessions; observed rate in benchmark + S360 is 2-3+ per 10.

### Scope correction

A pre-flight diff during release prep reported 46 files differing between Edition v1.5.0 and the v2 candidate workspace. On verification (parent-commit checkout + spot-check) the 43 "accumulated v2-candidate dev" files were already byte-identical to Edition v1.5.0; the apparent difference was line-ending normalization (CRLF in Edition vs LF in the v2 candidate scratch workspace) that git smooths over at commit time. The **actual v2.0.0 release scope is 3 instruction files** (Phase 3.3 + Phase 5 + terminal-safety) plus VERSION + CHANGELOG. This entry was corrected before push.

### Upgrade

```pwsh
node .github/scripts/upgrade-self.cjs --allow-major
```

Heirs preserve all of: `skills/local/`, `.act-heir.json`, `HANDOFF.md`, `episodic/`, `workflows/`, `scripts/` (heir-specific), `docs/`, all non-`.github/` content. Heir-doctor may surface cosmetic warnings on first run if the heir's `edition-manifest.json` is stale; they clear after upgrade completes.

### Why

The v1 line optimized brain size; v2 optimizes brain *outcomes*. The Phase 1 baseline benchmark surfaced one real coverage gap (output-verification — verify before reporting search/doc claims, scored 2/3 not 3/3 in S4 and S7). Phase 2 dual audit of all 17 always-on rules produced 1 Grow / 8 Compose / 8 Unchanged / 0 Shrink / 0 Restructure — confirming the brain isn't bloated, it's a tightly composed system where every rule earns its cost. Phase 3 applied the Grow (epistemic-calibration Output-discipline). Phase 5 added the complementary Explain/Summarize frame for surface patterns the Phase 3 literal triggers miss. Terminal-safety added the temp-file location guidance to close a heir-reported defect that hit S360 twice.

The release reaches Edition because S360 adopted v2 candidate in real-world product work on 2026-05-19 and demonstrated all the predicted improvements PLUS a real Tenet X self-correction moment (v2 brain refused a stale Supervisor instruction). Real-world signal outweighs synthetic benchmark for ship/no-ship decisions.

### Falsifiability

This release is wrong if any of the following occur within 14 days:

- ≥2 heirs report behavior regressions traceable to Phase 3.3 or Phase 5 changes (triggers partial rollback or v2.0.1 fix-forward)
- The terminal-safety fix doesn't prevent a `.commit-msg.tmp`-class leak in a heir that upgrades to v2.0.0
- S360 reverts its `.act-heir.json` marker from `2.0.0` back to `2.0.0-candidate` or below (the bellwether heir)
- A fleet-cost regression appears that wasn't visible in the 5-scenario benchmark (triggers the Phase 6.2 light re-baseline that was deferred)

If any fire: cut v2.0.1 with fix; document in Supervisor's `brain-qa-changelog.md` tagged `[V2-REGRESSION]`.

### References

- Launch proposal: [`Alex_ACT_Supervisor/docs/proposals/edition-v2-launch-2026-05-19.md`](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/docs/proposals/edition-v2-launch-2026-05-19.md)
- Benchmark data: `Alex_ACT_Supervisor/benchmark/v2-candidate-baseline.md`
- Plan: `Alex_ACT_Edition_v2/PLAN-v2-REASONING.md`

---

## [1.5.0] - 2026-05-18

Minor — converter-qa harness restoration + complete-coverage tests for all converters (PNG + SVG image handling verified end-to-end).

### Added

- **converter-qa suites for previously uncovered converters**:
  - `md-to-html.cjs: end-to-end + image handling` — structural HTML (DOCTYPE, CSS, headings, lists, tables, links, blockquotes, code), PNG embedding (data URI or referenced), SVG handling (inline / data URI / `<img>` ref)
  - `md-to-txt.cjs: strip formatting + preserve image alt text` — formatting markers removed (`**`, `*`, backticks, `#`, `|`), content + image alt text preserved
  - `html-to-md.cjs: structure + image preservation` — headings (ATX or setext), bold/italic, bullet + numbered lists, tables (pipe / simple / grid form), links, blockquotes, code, PNG + SVG image refs preserved with alt text
  - `docx-to-md.cjs: round-trip + image extraction` — md → docx → md via md-to-word leg + docx-to-md leg; headings, lists, tables, and image extraction (or inline ref preservation) verified
- **`md-to-word.cjs: [toc] marker warn-and-ignore` suite** — confirms v1.4.0 behavior (warning logged when `[toc]` marker found without `--toc`, marker stripped from body, output docx has no TOC field)
- **Font + margin value assertions** added to `md-to-word.cjs: table styling regression` suite — header `w:sz="18"` (9pt), data `w:sz="17"` (8.5pt), cell margins `w:w="20"` (1pt T/B) + `w:w="60"` (3pt L/R). Catches the v1.4.0 numeric changes that previously flowed through silently
- **`createImageFixtures` helper** in converter-qa — generates a minimal 1x1 PNG (67 bytes, embedded as binary literal) + a labeled SVG fixture for use across the new converter suites
- **SVG image section** added to `docs/testing/md-to-word-coverage.md` regression corpus

### Removed

- **4 dead test suites** referencing modules that no longer exist:
  - `Shared: replicate-core.cjs` (3 suites: base, batch retry & validation, negative-prompt & prompt-file)
  - `Shared: svg-pipeline.cjs`
  - These were pre-Edition artifacts from a Replicate AI image-gen + SVG pipeline that has been out of the brain for some time. The harness FATALed on the first missing module, blocking the entire test run
- **2 obsolete callout assertions** in `Shared: markdown-preprocessor.cjs` suite — `::: tip` and `> [!WARNING]` callout transformation tests. The preprocessor never implemented these (always returned input unchanged), and the syntaxes aren't part of any active Edition workflow. If callout rendering is needed in the future, separate feature request
- **2 file-inventory checks** for `shared/replicate-core.cjs` and `visual-memory.json` (also no longer exist)

### Changed

- `converter-qa.cjs` internal version 1.2.0 → 1.3.0; JSDoc updated to reflect new suite list and assertion count (284 → 256 after dead-suite removal + new-suite additions; net: cleaner)

### Why

User request: "make sure all other converters do a complete job" with explicit "mds can contain svg and png images, make sure they are supported by the converters." Before this release, only `md-to-word` and `md-to-eml` had dedicated suites; the other 4 converters had zero coverage, and the harness FATALed at startup so even existing suites couldn't run end-to-end. Result: **256 PASS, 0 FAIL, 4 SKIP** (skips are pandoc-availability checks when pandoc is missing in CI, plus adm-zip on systems without it).

### Falsifiability

If a converter regresses on PNG or SVG handling in a future change, the new suites will catch it. If callout syntax becomes a real requirement, add the feature to `markdown-preprocessor.cjs` and re-add the assertions (or new ones) — the prior version is in git history.

---

## [1.4.0] - 2026-05-18

Minor — `md-to-word` table tightening + `[toc]` marker honors documented default.

### Changed

- **`muscles/md-to-word.cjs` table styling** (internal muscle version 5.4.0 → 5.5.0):
  - Header font: 10pt → **9pt** (`w:sz` 20 → 18) — still bold white on Microsoft blue
  - Data cell font: 9pt → **8.5pt** (`w:sz` 18 → 17)
  - Cell margins: T/B 40 twips (2pt) → **20 twips (1pt)**, L/R 80 twips (4pt) → **60 twips (3pt)**
  - Visible effect: denser, more reference-document-style tables; same colors, borders, and zebra striping
- **`muscles/md-to-word.cjs` `[toc]` marker semantic**: previously, a `[toc]` line in the source silently set `args.toc = true`. Now the marker line is still stripped from the source, but TOC is **not** auto-enabled. A warning is logged so the heir can either pass `--toc` explicitly or remove the marker. Aligns the skill with its documented default (`--toc | off`).
  - Version-management note: classified as **minor** rather than major because the `[toc]` auto-detect was never in the skill's documented Options table — it was a side-effect of the preprocessor. Removing an undocumented side-effect to honor the documented default is a quality fix, not a breaking change to the documented contract. Heirs whose source files use `[toc]` AND who don't pass `--toc` will see the warning in their next conversion run and can adjust trivially. If a heir reports regression within 14 days, fallback is v1.4.1 reverting just the `[toc]` semantic.
- `skills/md-to-word/SKILL.md` — Options table notes new `[toc]` marker behavior; Table Formatting section reflects 9pt/8.5pt fonts and 1pt/3pt padding; Version History gains v5.5.0 row; currency + lastReviewed stamped 2026-05-18.

### Added

- `docs/testing/md-to-word-coverage.md` — regression corpus exercising every markdown feature the skill claims to support (H1-H6, inline formatting, all list types, tables with alignment and pagination, code blocks in multiple languages, blockquotes including nested, horizontal rules, footnotes, PNG image refs, Mermaid flowchart / sequence / state / class diagrams). Includes a 21-item verification checklist for post-conversion spot-check, and a TOC-marker behavior test procedure.

---

## [1.3.4] - 2026-05-18

Patch — heir discoverability of the AI-Memory formal contract.

### Changed

- `skills/ai-memory-setup/SKILL.md` — added "Formal contract" subsection pointing heirs at `AI-Memory/SCHEMA.md` (the Supervisor-maintained contract document covering subfolder ownership, frontmatter, and lifecycle rules). Folder Structure tree updated to show `SCHEMA.md` at root.
- `skills/ai-memory-setup/SKILL.md` § Write Feedback — aligned filename format and frontmatter description to the canonical shape in SCHEMA.md (filename now `YYYY-MM-DD-<heir-id>-<short-slug>.md`; frontmatter keys `date`, `heir_id`, `severity`, `category` — lowercase, matches what Supervisor expects when triaging).

No behavior change. Purely heir-facing documentation alignment so the deployed spec and the Supervisor-side contract agree.

---

## [1.3.3] - 2026-05-18

Final cleanup of the handoff-tier convention introduced in v1.2.2. Reading side now agrees with the writing side: prior-session context comes from repo-root `HANDOFF.md` first, session memory only as legacy fallback.

### Fixed

- **`instructions/proactive-awareness.instructions.md`** Cross-Session Context Recovery (PA1): Step 1 now checks repo-root `HANDOFF.md` first (the canonical cross-session handoff per `memory-triggers.instructions.md`). Session memory becomes Step 2, labeled as "legacy/secondary signal" with an explicit note that any handoff content there predates the v1.2.2 tier convention. Surface-context table updated to recognize `HANDOFF.md present with recent content` as the primary trigger.

### Why

v1.2.2 + v1.3.1 + v1.3.2 fixed the *write* side (where handoff content goes). The *read* side (`proactive-awareness` Step 1) was still pointing at `/memories/session/` as the primary source for prior-session context. Symmetry now holds: write to `HANDOFF.md`, read from `HANDOFF.md`.

### Verification

- brain-qa exit 0 (58 Edition files)
- test-edition-applyto-coverage 18/18 PASS, 0 gaps

---

## [1.3.2] - 2026-05-18

Internal consistency fix for the handoff-tier convention shipped in v1.2.2 + v1.3.1. Two files still routed handoff content to ephemeral session memory — the exact pattern s360 originally flagged.

### Fixed

- **`skills/meditation/SKILL.md`** Extract routing table: replaced `Session continuity for next chat → /memories/session/<name>.md` with `Cross-session handoff (next session needs to know) → repo file (HANDOFF.md at repo root) — NOT session memory`. The skill's Extract step now agrees with its Handoff step (Step 5) and with `memory-triggers.instructions.md` / `save-session-note.prompt.md`.
- **`skills/meditation/SKILL.md`** Step 5 (Handoff): renamed `SESSION-HANDOFF.md` → `HANDOFF.md`. v1.3.1's rename had missed this SKILL.md file (caught in heir-aware spot-check).
- **`instructions/session-health-monitoring.instructions.md`** Graceful Handoff section: was telling the agent to write state + completed work + next steps + pending decisions to `/memories/session/[name].md` (which clears at conversation end). Now routes to repo-root `HANDOFF.md` with an explicit "session memory is for in-conversation scratch only" clarifier.

### Verification

- brain-qa exit 0 (58 Edition files)
- test-edition-applyto-coverage 18/18 PASS, 0 gaps
- Zero `write /memories/session/...` handoff misroutings remaining in the live brain tree (verified via grep)

---

## [1.3.1] - 2026-05-18

Naming clarity + zero-behavior-change refactor. Per proposal `docs/proposals/prompt-overlap-audit-2026-05-18.md` (Supervisor side).

### Changed

- **Session-handoff artifact unified on `HANDOFF.md`** (was `SESSION-HANDOFF.md`). Per user instruction: "saved in root... always use root, like we did here". Updated 4 files in lockstep:
  - `instructions/meditation.instructions.md`
  - `prompts/meditate.prompt.md`
  - `prompts/note.prompt.md`
  - `prompts/save-session-note.prompt.md`

  This unifies with the convention `memory-triggers.instructions.md` ships in v1.2.2 (cross-session continuity → repo file `HANDOFF.md`, not session memory). The two filenames were a naming inconsistency introduced earlier today; v1.3.1 fixes it.

  `save-session-note.prompt.md` includes a legacy-migration note: if a heir still has `SESSION-HANDOFF.md` at root from before this rename, the prompt mentions it during confirm — the heir manually reviews and either merges into `HANDOFF.md` or deletes the legacy file. Never silently discards content.

- **`welcome` baseline extracted to config** — the user-scope VS Code settings payload that `/welcome` applies and `/welcome-verify` audits previously lived duplicated in both prompt files. Future drift trap removed by extracting to `.github/config/welcome-baseline.json` as the single source of truth. Both prompts now load from there. Updated `sync-policy.json` to mark the new config file as `edition_owned` (overwritten on upgrade).

### Added

- **`.github/config/welcome-baseline.json`** — the VS Code user settings baseline applied by `/welcome` and audited by `/welcome-verify`. Edit once, both prompts pick it up.

---

## [1.3.0] - 2026-05-18

Tier 3 token rationalization: port of verified Supervisor trims plus load-bearing Tenet X discipline added to the always-on ACT pass. Always-on body tokens: 12,467 → 11,863 (-604, -4.8%). Zero capability regression — verified by `scripts/test-edition-applyto-coverage.cjs` (18/18 scenarios pass). Per proposal `docs/proposals/edition-optimization-2026-05-18.md` (Supervisor side, Batch 2).

### Added

- **`act-pass.instructions.md` § Self-Application (Tenet X always-on hook)**: 6-row pattern/signal/correction table (reasoning theatre, hedge laundering, authority deference, symmetric balance, adversarial-probe skip, self-flattering meta-cognition) so the always-on pass enforces the Tenet X discipline. Previously this discipline lived only in `act-foundations` (which is now scoped on the Supervisor side; will be evaluated for Edition in a later batch).
- **`tool-awareness-categories.instructions.md`** (NEW, scoped): Common deferred tool categories table moved out of `tool-awareness.instructions.md` to a scoped sibling that loads only on tool/MCP/GitHub/browser/notebook work. Always-on file shrinks; reference table still available where needed.

### Changed

- **`communication-craft.instructions.md`** trimmed (989 → 660 tokens): dropped Explaining Concepts §2, Tone Anti-Patterns, Integration table; kept SBI + stakes + voice + audience lead + needs/solutions tables. LLM-inherited communication behaviors no longer need always-on reinforcement.
- **`session-health-monitoring.instructions.md`** trimmed (774 → 398 tokens): dropped High-Token-Cost Operations table (duplicates `tool-awareness`), Session Memory Template (operational on-demand), Integration section; kept proxy heuristics + warning signs + checkpoints + handoff.
- **`emotional-intelligence.instructions.md`** trimmed (658 → 468 tokens): collapsed Adaptation Rules verbose sections to single 4-row table; kept signal detection table + mimicry prevention as one paragraph.
- **`knowledge-coverage.instructions.md`** trimmed (425 → 244 tokens): compressed KS2 pre-response assessment + KS3 visible-badge logic to taxonomy table + brief rule.
- **`tool-awareness.instructions.md`** trimmed (499 → 263 tokens): moved Common Deferred Tool Categories table to new scoped `tool-awareness-categories.instructions.md`; kept core Rules + External Ingest.

### Falsifiability watch (2 weeks)

If reasoning quality degrades within 2 weeks (sycophancy returns, alternatives missed, instructions ignored), the most likely culprit is the `act-pass` Tenet X addition or the `tool-awareness` split. Revert in that order. Falsifier closes 2026-06-01.

---

## [1.2.2] - 2026-05-18

### Fixed

- **`memory-triggers.instructions.md`**: Clarified that session-handoff documents live in repo `HANDOFF.md`, not in `/memories/session/` (which is cleared at conversation end). Per heir feedback (s360, 2026-05-09 `handoff-tier-confusion`): the natural phrase "session handoff" reads like exactly what session memory is for, but session memory is by-design ephemeral. The Memory Tier Selection table now distinguishes "Cross-session handoff (next session needs to know)" from "In-conversation scratch (current session only)". New § "Cross-Session Continuity" makes the rule explicit. Trigger Conditions table now points the "Session > 30 min OR end-of-session" trigger at the repo file rather than a generic "Handoff" prompt.

---

## [1.2.1] - 2026-05-13

### Added

- **Brain audit trifecta**: Added `brain-audit.instructions.md`, `skills/brain-audit/SKILL.md`, and `/audit-brain` workflow support.
- **Dedicated audit worker**: Added `agents/brain-auditor.agent.md` for deterministic local Edition audits.
- **Mall refresh workflow**: Added drift-aware `/mall refresh` support and docs wiring for curated-subset states.

### Fixed

- **Audit robustness**: Hardened Edition audit flows for template context and npm probe handling.

### Changed

- Propagated Supervisor-side audit remediations into Edition artifacts.

---

## [1.2.0] - 2026-05-05

### Added

- **Mall contribute prompt**: New `/mall contribute` command for submitting plugins to the Plugin Mall.
- **Tool awareness instruction**: New `tool-awareness.instructions.md` documenting deferred tools and external ingest.

### Fixed

- **Instruction count**: 33 → 34 across documentation (README, copilot-instructions).
- **converter-qa stale currency tag**: Updated to current date.

### Removed

- **`/fleet` prompt**: Moved to Supervisor scope (not heir-relevant).

---

## [1.1.0] - 2026-05-05

### Added

- **Tool awareness instruction**: New `tool-awareness.instructions.md` documents deferred tools (require `tool_search` before use) and external ingest for remote/virtual workspaces (VS Code 1.118/1.119).
- **VS Code 1.118 agentic execution sub-tool note** in `terminal-command-safety.instructions.md`: documents output pre-filtering behavior and when redirect-to-file fallback is still needed.
- **AI-Memory knowledge index**: Heirs now pointed to `AI-Memory/knowledge/index.json` for on-demand reference material.
- **Extension scaffold relocated**: VS Code extension moved to independent repo `Alex_ACT_Extension`.

### Fixed

- **23 epistemic-integrity findings resolved** across 19 brain files (ABS01x4, OVR01x1, REV01x18): added revision conditions, qualified absolute claims, and sourced authority claims. Epistemic integrity score: 91 to 100/100.
- **Stale references**: `/find-skill` to `/mall search`, `/install-from-mall` to `/mall install`, corrected skill/instruction counts.
- **Cross-platform improvements**: Path resolution and file handling.

### Changed

- Removed `.github-v0` pre-refactor brain backup (no longer needed post-v1.0.0).
- Project docs (PLAN, decisions/) relocated to `Alex_ACT_Supervisor`.

---

## [1.0.0] - 2026-05-02

The v1 brain refactor: a complete restructure of the cognitive architecture for clarity, token efficiency, and maintainability. Every instruction, skill, prompt, and muscle was re-evaluated, clustered, trimmed, or consolidated.

### Breaking

- **Architecture table replaced**: `copilot-instructions.md` now describes 8 functional clusters (was 7 generic domains). Heir `copilot-instructions.local.md` that reference old domain names ("Reasoning", "Learning", "Growth") should update.
- **6 converter instructions consolidated into 1**: `docx-to-md`, `html-to-md`, `md-to-html`, `md-to-txt`, `md-to-word`, `md-to-eml` instructions replaced by single `converter.instructions.md`. Format-specific logic stays in skills. Heirs with custom converter references should update to `/convert`.
- **`plugin-store-routing` removed**: Absorbed into `mall-installation.instructions.md`. Heirs referencing it by name should update.
- **5 instructions demoted from always-on to conditional**: `alternatives-and-tradeoffs`, `agent-delegation`, `partnership-charter`, `worldview`, `creative-loop`. They still fire on relevant file patterns and conversational context, but no longer consume always-on token budget.
- **`upgrade-self.cjs` major-version path now backs up and recreates**: Major bumps trigger backup + fresh install + recovery of heir-owned content (was in-place overwrite). Requires `--allow-major`.
- **`.github/episodic/**` is now heir-owned**: Was edition-owned (silently wiped on upgrade). Meditations, post-mortems, and calibration logs are preserved.

### Added

- **AI-Memory setup**: new standard skill (`ai-memory-setup`) with 8-provider cloud drive discovery (OneDrive, iCloud, Dropbox, Google Drive, Box, MEGA, pCloud, Nextcloud), auto-create, CLI (`_registry.cjs --discover/--init/--resolve`), and `cognitive-config.json` persistence (`ai_memory_root`, `ai_memory_exclude`).
- **`bootstrap-heir.cjs --ai-memory` flag**: Explicit cloud drive selection during bootstrap. Auto-creates AI-Memory and persists the choice.
- **`ACT.md` onboarding note**: Generated on bootstrap with project-aware plugin recommendations based on detected tech stack.
- **Heir-added artifact relocation**: `upgrade-self.cjs` detects artifacts heirs placed in edition-owned paths and relocates them to `local/` automatically (incremental and major paths).
- **Deprecated file cleanup**: `upgrade-self.cjs` removes files that Edition no longer ships.
- **Pass 3.5 (Episodic Memory)** in `finalize-migration.prompt.md`: Guides heirs to restore episodic files during migration.
- **Plugin Mall v2 integration**: `/mall search` and `/mall install` prompts, `plugin.json` manifests, shape/engines/token_cost metadata, CATALOG.json v2.1.
- **Worker subagents**: `markdown-author`, `illustrator`, `document-assembler` for delegated mechanical work.
- **`edition-manifest.json`**: Machine-readable inventory of shipped skills, prompts, agents. Used by `heir-doctor.cjs` (replaces stale hardcoded allowlists).
- 17 skills (was 11), 20 prompts (was 19), 3 agents (new), 20 muscles.

### Fixed

- Mall repo name: all `gh api` and `git clone` URLs updated from `Alex_ACT_Plugin_Mall` to `Alex_Skill_Mall` (the actual GitHub repo name).
- Episodic wipe on upgrade: moved `.github/episodic/**` from `edition_owned` to `heir_owned` in `sync-policy.json`.
- Episodic drop on migration: removed `episodic/` from `EXTENSION_ONLY` patterns in `migrate-to-edition.cjs`.
- `heir-doctor.cjs` false positives: now reads `edition-manifest.json` instead of hardcoded allowlists.
- AI-Memory path resolution: standardized across all artifacts (was 6 different hardcoded candidate lists). Now all flow through `cognitive-config.json` override + auto-discovery.
- Windows reparse points: cloud drive folders with `ReparsePoint` attribute (common for OneDrive) now detected by `_registry.cjs`.

### Changed

- Always-on token budget: 25,835 (v0.9.1) to 13,886 (v1.0.0). 46% reduction.
- Context-loaded artifacts: 79 (v0.9.1) to 73 (v1.0.0). 10 converters consolidated, 1 absorbed.
- Instructions: 37 (v0.9.1) to 33 (v1.0.0). DRY pass removed redundancy.
- `copilot-instructions.md` Architecture table: 7 generic domains replaced with 8 functional clusters matching actual artifact organization.
- `README.md`: Updated all artifact counts, removed stale references.

## [0.9.9] - 2026-05-02

Phase 0-9b of the v1 brain refactor. All 59 capabilities migrated and verified.

## [0.9.1] - 2026-04-30

Fleet pull-based architecture, heir self-update, Mall v2 design.

## [0.9.0] - 2026-04-30

Edition brain reset from AlexMaster. Clean baseline for v1 refactor.

## [0.7.0] - 2026-04-28

Initial Mall integration, converter improvements, mermaid fidelity.

## [0.6.2] - 2026-04-29

Mermaid viewport fix, ZWSP checkbox fix, banner cross-reference.
