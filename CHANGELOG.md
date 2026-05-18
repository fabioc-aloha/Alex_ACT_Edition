<!-- markdownlint-configure-file {"MD024": {"siblings_only": true}} -->

# Changelog

All notable changes to Alex ACT Edition.

## [Unreleased]

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
