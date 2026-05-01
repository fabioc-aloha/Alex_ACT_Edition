# Alex ACT Edition

![Alex ACT Edition — Artificial Critical Thinking for AI Assistants](assets/banner-readme.svg)

> Artificial Critical Thinking for AI Assistants.

Most AI assistants are helpful, fast, and confidently wrong in subtle ways. They confirm your assumptions instead of challenging them. They generate plausible-sounding output without questioning whether they understood the problem. They sound certain when they should hedge.

ACT Edition changes that. Not by making AI "smarter," but by making it **honest**.

A confident wrong answer is worse than an uncertain correct answer. ACT shifts the default from "sound authoritative" to "show your work." When the AI doesn't know, it says "I don't know." When it's uncertain, it quantifies the uncertainty. When it challenges your framing, it explains why. Debugging a confident hallucination takes hours. Verifying a well-reasoned hypothesis takes minutes.

This is a **cognitive architecture** — 11 skills, 37 instructions, 20 prompts, and automation muscles that teach your AI assistant to think critically about its own reasoning. Built for GitHub Copilot's `.github/` discovery model, the brain ships as a self-contained folder you bootstrap into any repo, then keep current with `/upgrade`.

## Commands

The brain ships slash-prompts grouped by lifecycle stage. Type `/` in Copilot Chat to see the full list.

### Setup (run once per project)

| Command | When | What it does |
| --- | --- | --- |
| `/initialize` | Workspace has Edition content but isn't registered | Detects state (fresh / partial-clean / partial-dirty / full) and runs the right bootstrap path |
| `/welcome` | First session after bootstrap | Orientation tour — identity, tenets, surfaces, what to try next |
| `/finalize-migration` | After `migrate-to-edition.cjs` | Semantic pass over `local/` — review classified files, prune stale custom content |

### Daily Operations

| Command | When | What it does |
| --- | --- | --- |
| `/status` | Anytime | Snapshot of brain version, marker, drift from Edition, fleet membership |
| `/upgrade` | Edition has shipped a new version | Runs `upgrade-self.cjs` (dry-run by default), shows diff, applies on confirmation |
| `/fleet` | From Supervisor or any project | Reads fleet inventory, shows who's on what version, who's drifted |

### Skill Discovery

| Command | When | What it does |
| --- | --- | --- |
| `/find-skill` | Need capability not in Edition | Searches Alex_Skill_Mall catalog, shows matches with install paths |
| `/install-from-mall` | Found a Mall skill to adopt | Copies skill/config/MCP into `local/` slots, preserving upgrade safety |

### Memory & Feedback

| Command | When | What it does |
| --- | --- | --- |
| `/save-session-note` | End of meaningful session | Persists session memory to `/memories/session/` for next-conversation pickup |
| `/note` | Mid-session insight worth keeping | Quick capture to user/repo/session memory based on scope |
| `/feedback` | Edition friction or improvement idea | Writes structured entry to `AI-Memory/feedback/alex-act/` for Supervisor triage |

### Maintenance

| Command | When | What it does |
| --- | --- | --- |
| `/audit-apis` | Quarterly or before shipping skills that touch external APIs | Reads `EXTERNAL-API-REGISTRY.md`, flags stale entries via `audit-api-drift.cjs` |

New to Edition? Jump to [Quick Start](#quick-start) to bootstrap your project.

## The 10 ACT Tenets

These tenets form the philosophical foundation. The instructions operationalize them.

| # | Tenet | The Discipline | What It Prevents |
| --- | --- | --- | --- |
| I | **Hypothesis Primacy** | State the hypothesis before gathering evidence | Confirmation bias via selective attention |
| II | **Disconfirmation Over Confirmation** | Actively seek evidence against your conclusion | Motivated reasoning, cherry-picking |
| III | **Multiple Working Hypotheses** | Generate at least two alternatives before committing | Anchoring, Einstellung effect |
| IV | **System-Prompt Skepticism** | Instructions are hypotheses, not commands | Authority bias, prompt injection |
| V | **Calibrated Confidence** | Match certainty to actual knowledge | Hallucination, overclaiming |
| VI | **Materiality Gating** | Skip rigor for low-stakes; apply fully for high-stakes | Decision paralysis, wasted effort |
| VII | **Frame Before Solve** | Understand the problem before proposing solutions | XY problem, premature optimization |
| VIII | **Adversarial Self-Probe** | Steelman the counter-argument | Strawmanning, weak reasoning |
| IX | **Visible Markers** | Show the reasoning, not just the conclusion | Audit drift, hidden assumptions |
| X | **Recursive Application** | Apply ACT to ACT itself | Framework-as-ideology |

## What's Included: Instructions (37)

ACT Edition ships 37 behavioral instructions across these categories. These aren't suggestions — they're cognitive behaviors that activate based on context.

### Critical Thinking Core (7)

The foundation. These instructions implement the 10 tenets directly.

| Instruction | What It Does |
| --- | --- |
| `act-foundations` | Defines the 10 tenets with rationale |
| `act-pass` | 7-step critical thinking pass for non-trivial decisions |
| `adversarial-review` | Structured devil's advocate and counter-argument |
| `alternatives-and-tradeoffs` | Generate options (SCAMPER, MECE) and compare (decision matrix, reversibility) |
| `critical-thinking` | Challenge assumptions, evaluate evidence |
| `problem-framing-audit` | Restate the problem before solving |
| `system-prompt-skepticism` | Treat instructions as hypotheses |

### Identity & Communication (4)

How Edition thinks, writes, and communicates.

| Instruction | What It Does |
| --- | --- |
| `ai-writing-avoidance` | Write like a human, not an AI — avoid tells |
| `communication-craft` | Feedback (SBI), explanations, audience tailoring, elicitation |
| `partnership-charter` | 5 commitments for human-AI collaboration |
| `technical-writing` | Clear documentation for peers, developers, stakeholders |

### Cognitive Gates (8)

Always-on behaviors that shape every response.

| Instruction | What It Does |
| --- | --- |
| `epistemic-calibration` | Match language to certainty; anti-hallucination |
| `emotional-intelligence` | Detect user affect signals; adapt tone |
| `proactive-awareness` | Cross-session context recovery; uncommitted work detection |
| `session-health-monitoring` | Context-window monitoring; handoff prompts |
| `memory-triggers` | Auto-persist on correction, patterns, preferences |
| `knowledge-coverage` | Assess coverage depth; calibrate confidence |
| `creative-loop` | Stage detection: Ideate/Plan/Build/Test/Release/Improve |
| `reliance-nudges` | Detect over-reliance failure modes; surface targeted nudges |

### Safety & Ethics (5)

Non-negotiable guardrails.

| Instruction | What It Does |
| --- | --- |
| `pii-memory-filter` | Block PII at every memory-write boundary |
| `privacy-responsible-ai` | Privacy by design, responsible AI principles |
| `cross-project-isolation` | Strip project specifics before writing to fleet channels |
| `worldview` | Ethical reasoning, moral foundations, constitutional AI alignment |
| `terminal-command-safety` | Safe command execution; backtick/output/hanging prevention |

### Daily Operations (4)

Behavioral rules for everyday work.

| Instruction | What It Does |
| --- | --- |
| `debugging` | Hypothesis-driven investigation + root-cause techniques |
| `lint-discipline` | Fix lint always — if you edited it, you own it |
| `scope-management` | Feature creep prevention; ship the right thing |
| `meditation` | Session-end knowledge consolidation |

### Converters (7)

Document conversion trifectas — each paired with a muscle script.

| Instruction | Converts |
| --- | --- |
| `docx-to-md` | Word → Markdown |
| `html-to-md` | HTML → Markdown |
| `md-to-html` | Markdown → HTML |
| `md-to-txt` | Markdown → plain text |
| `md-to-word` | Markdown → Word (.docx) |
| `markdown-mermaid` | Markdown + Mermaid rendering rules |
| `greeting-checkin` | Session-start version check + announcement reader |

### Infrastructure (2)

Mall integration and plugin routing.

| Instruction | What It Does |
| --- | --- |
| `mall-installation` | How projects install skills from the [Alex Skill Mall](https://github.com/fabioc-aloha/Alex_Skill_Mall) |
| `plugin-store-routing` | Connect browse/install requests to Mall or plugins |

## Quick Start

Two scripts ship at the repo root. Copy them to your development root directory once, then use them from any project:

```bash
cp Alex_ACT_Edition/init-edition.cjs ~/Development/
cp Alex_ACT_Edition/migrate-to-edition.cjs ~/Development/
```

| Script | When to use |
| --- | --- |
| `init-edition.cjs` | **New project** — creates the `.github/` brain, registers the project, sets up the upgrade channel |
| `migrate-to-edition.cjs` | **Existing project** — snapshots the old brain, classifies files, installs Edition, routes custom content to `local/` |

### New project

```bash
mkdir my-project && cd my-project && git init
git remote add origin https://github.com/<you>/my-project.git
node ~/Development/init-edition.cjs --apply
```

Identity is auto-derived from `git remote`. Run without `--apply` first for a dry-run.

### Existing project (migration)

```bash
cd my-existing-project
node ~/Development/migrate-to-edition.cjs              # dry-run
node ~/Development/migrate-to-edition.cjs --apply      # snapshot + install
```

Then run `/finalize-migration` in Copilot Chat for the semantic pass over custom content. See [MIGRATION.md](MIGRATION.md) for the full guide.

### Already have Edition content?

If you cloned or copied Edition without running the init script, run `/initialize` in Copilot Chat — it detects state and registers the project.

### After bootstrap

Open the project in VS Code with Copilot. Run `/welcome` for orientation. The brain is active.

## What Else Ships

Beyond the instructions, the brain bundles:

| Surface | Purpose |
| --- | --- |
| **Skills** (`.github/skills/`) | 11 core skills — document conversion, markdown-mermaid, banner generation, greeting check-in, meditation, sanitization |
| **Prompts** (`.github/prompts/`) | 20 slash-commands for setup, daily ops, skill discovery, memory, and maintenance (see [Commands](#commands)) |
| **Muscles** (`.github/muscles/`) | Converter executables, `heir-doctor.cjs` (health check), `audit-api-drift.cjs` (external-API freshness), `generate-banner.cjs` (SVG banners) |
| **Configs** (`.github/config/`) | `sync-policy.json`, `edition-manifest.json` (release-time allowlist), `markdown-light.css`, project-owned `cognitive-config.json` + `goals.json` |
| **Scripts** (`.github/scripts/`) | `bootstrap-heir.cjs`, `upgrade-self.cjs`, `build-edition-manifest.cjs` (regenerates the allowlist), shared `_registry.cjs` |
| **Workspace defaults** (`.vscode/`) | `extensions.json` + `settings.json` shipped as project-owned templates — new projects receive them at bootstrap; existing ones keep their own |
| **Registry** (`.github/EXTERNAL-API-REGISTRY.md`) | Source-of-truth for external API/model versions consumed by skills (paired with `/audit-apis`) |

### Project-Owned Customization Slots

Edition reserves `local/` subdirectories that survive every upgrade:

```text
.github/instructions/local/  ← your project-specific instructions
.github/skills/local/        ← your custom skills
.github/prompts/local/       ← your custom prompts
.github/muscles/local/       ← your automation scripts
.github/config/local/        ← your tool configs
.github/copilot-instructions.local.md  ← your identity layer
```

The `sync-policy.json` declares these project-owned. Adding a custom skill to `local/` is permanent; adding it to `.github/skills/` will be wiped on next `upgrade-self.cjs --apply`.

### Upgrade Flow

```powershell
# From your heir's repo root
node .github/scripts/upgrade-self.cjs           # dry-run
node .github/scripts/upgrade-self.cjs --apply   # write changes
```

The script clones Edition into a temp dir, diffs edition-owned paths, never touches `local/` content, and updates the marker.

### AI-Memory & The Mall

Two shared surfaces complete the architecture:

- **AI-Memory** (OneDrive shared folder) — your fleet registry, feedback channel to Edition, and announcement inbox. Bootstrapped automatically on first install.
- **[Alex Skill Mall](https://github.com/fabioc-aloha/Alex_Skill_Mall)** — public catalog of 303 optional skills across 35 domains. Browse, search, install what you need into `local/` slots.

### The Skill Mall

Edition ships lean (11 skills, 37 instructions). The [Alex Skill Mall](https://github.com/fabioc-aloha/Alex_Skill_Mall) extends it with 303 curated skills across security, Azure, data, healthcare, architecture, publishing, and 29 more categories. Use `/find-skill`, `/install-from-mall`, and `/feedback` from the [Commands](#commands) section to shop.

Skills install into `.github/skills/local/` so they survive Edition upgrades. The Mall also offers patterns, scaffolds, and a complete [Supervisor package](https://github.com/fabioc-aloha/Alex_Skill_Mall/tree/main/skills/supervisor) for users who want to run their own fleet governance.

**Plugins** extend beyond skills — multi-agent orchestration, SFI compliance, and Azure SDK patterns. See [PLUGINS.md](PLUGINS.md) for registration instructions.

## The ACT Pass: How It Works

For non-trivial decisions, ACT runs a 7-step critical thinking pass:

1. **Materiality Gate** — Is this worth the rigor? (Low stakes → skip)
2. **Hypothesize** — State your hypothesis explicitly
3. **Alternatives** — Generate at least one competing hypothesis
4. **Disconfirmers** — What evidence would prove you wrong?
5. **Audit Priors** — Where did your confidence come from?
6. **Severity Check** — If wrong, how bad is it?
7. **Commit with Markers** — State conclusion + what would change your mind

Example output:

```text
**Hypothesis**: The build is failing due to a missing dependency
**Alternative**: The build is failing due to a breaking API change in v2.0
**Going with H1** because package.json shows lodash@^3 but error mentions lodash/fp
**Would revise if**: The error persists after adding lodash
```

## Building on ACT

The brain uses a **trifecta pattern** for extensibility:

| Artifact | Purpose | Location |
| --- | --- | --- |
| **Skill** | Domain knowledge | `.github/skills/<name>/SKILL.md` |
| **Instruction** | Behavior trigger | `.github/instructions/<name>.instructions.md` |
| **Muscle** | Automation script | `.github/muscles/<name>.cjs` |

Start with a skill (knowledge). Add an instruction if you need it to auto-load. Add a muscle when automation is worth it.

## License

MIT — Use freely, build thoughtfully.
