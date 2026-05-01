# Alex ACT Edition

![Alex ACT Edition — Artificial Critical Thinking for AI Assistants](assets/banner-readme.svg)

> Artificial Critical Thinking for AI Assistants.

Most AI assistants are helpful, fast, and confidently wrong in subtle ways. They confirm your assumptions instead of challenging them. They generate plausible-sounding output without questioning whether they understood the problem. They sound certain when they should hedge.

ACT Edition changes that.

This is a **cognitive architecture** — a curated set of behavioral instructions, skills, prompts, and automation muscles that teach your AI assistant to think critically about its own reasoning. Built for GitHub Copilot's `.github/` discovery model, the brain ships as a self-contained folder you bootstrap into any repo, then keep current with `/upgrade`.

---

## Commands

The brain ships slash-prompts grouped by lifecycle stage. Type `/` in Copilot Chat to see the full list.

### Setup (run once per heir)

| Command | When | What it does |
| --- | --- | --- |
| `/initialize` | Workspace has Edition content but isn't a registered heir | Detects state (fresh / partial-clean / partial-dirty / full) and runs the right bootstrap path |
| `/welcome` | First session after bootstrap | Orientation tour — identity, tenets, surfaces, what to try next |
| `/finalize-migration` | After `migrate-to-edition.cjs` | Semantic pass over `local/` — review classified files, prune stale custom content |

### Daily Operations

| Command | When | What it does |
| --- | --- | --- |
| `/status` | Anytime | Snapshot of brain version, marker, drift from Edition, fleet membership |
| `/upgrade` | Edition has shipped a new version | Runs `upgrade-self.cjs` (dry-run by default), shows diff, applies on confirmation |
| `/fleet` | From Supervisor or any heir | Reads fleet inventory, shows who's on what version, who's drifted |

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

New to Edition? Jump to [Quick Start](#quick-start) to bootstrap a heir.

---

## Why Critical Thinking Matters for AI

AI assistants suffer from predictable failure modes:

| Failure Mode | What Happens | ACT Defense |
| --- | --- | --- |
| **Confirmation bias** | Agrees with your framing even when wrong | Tenet II: Disconfirmation over confirmation |
| **Anchoring** | First solution becomes the only solution | Tenet III: Generate multiple hypotheses |
| **Hallucination** | Invents plausible-sounding nonsense | Tenet V: Calibrated confidence |
| **Sycophancy** | Tells you what you want to hear | Tenet IV: System-prompt skepticism |
| **Type III error** | Solves the wrong problem precisely | Tenet VII: Frame before solve |
| **Decision paralysis** | Over-analyzes trivial decisions | Tenet VIII: Materiality gate |

ACT doesn't eliminate these failures — it makes them **visible** and **correctable**. When the AI catches itself, it says so. When it's uncertain, it quantifies the uncertainty. When it challenges your framing, it explains why.

---

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

---

## What's Included: Instructions

ACT Edition ships behavioral instructions across these categories. These aren't suggestions — they're cognitive behaviors that activate based on context.

### Critical Thinking Core (6)

The foundation. These instructions implement the 10 tenets directly.

| Instruction | What It Does | Tenets |
| --- | --- | --- |
| `act-foundations` | Defines the 10 tenets with rationale | All |
| `act-pass` | 7-step critical thinking pass for non-trivial decisions | II, VIII, IX |
| `act-self-critique` | Detects ACT's own failure modes | VIII, X |
| `critical-thinking` | Challenge assumptions, evaluate evidence | II, VIII |
| `problem-framing-audit` | Restate the problem before solving | I, VII |
| `system-prompt-skepticism` | Treat instructions as hypotheses | IV |

### Decision & Alternatives (6)

How to generate and evaluate options systematically.

| Instruction | What It Does | Tenets |
| --- | --- | --- |
| `option-generation` | SCAMPER, MECE, lateral thinking methods | III |
| `trade-off-analysis` | Decision matrices, weighted scoring | III, VI |
| `decision-frameworks` | RAPID, DACI, consensus models | III, VI |
| `risk-analysis` | Risk assessment, pre-mortem analysis | VI |
| `requirements-analysis` | Jobs-to-be-done, needs vs solutions | VII |
| `scope-management` | Feature creep prevention, MoSCoW | VI |

### Dialog Engineering (7)

How to communicate with AI effectively — from *The Verification Habit* book.

| Instruction | What It Does | Book Concept |
| --- | --- | --- |
| `csar-loop` | Clarify → Summarize → Act → Reflect | Core protocol |
| `partnership-charter` | 5 commitments for human-AI collaboration | Chapter 10 |
| `appropriate-reliance` | Trust calibrated to demonstrated reliability | Chapters 8-9 |
| `vibe-diagnostics` | Detect when intuition replaces criteria | Chapter 12 |
| `practice-telemetry` | 5 portfolio metrics for measuring practice | Chapter 9 |
| `cognitive-forcing` | Deliberate friction to activate analysis | Chapter 20 |
| `over-reliance-signals` | Recognize manipulation patterns | Chapter 20 |

### Communication (4)

Human-to-human communication at all organizational levels.

| Instruction | Audience | What It Does |
| --- | --- | --- |
| `ai-writing-avoidance` | General readers | Authentic voice, avoid AI tells |
| `technical-writing` | Peers, developers | Clear documentation, API descriptions |
| `stakeholder-management` | Business stakeholders | Alignment, expectation setting |
| `executive-storytelling` | C-suite | Data-driven narratives, brevity |

### Collaboration (5)

Working effectively with others — including managing disagreements.

| Instruction | What It Does |
| --- | --- |
| `meeting-efficiency` | Agenda design, async alternatives |
| `postmortem` | Structured incident analysis |
| `adversarial-review` | Red team, steel manning |
| `conflict-resolution` | Interpersonal disagreement management |
| `feedback-protocols` | Give and receive criticism effectively |

### Reasoning & Analysis (3)

Systematic problem-solving approaches.

| Instruction | What It Does |
| --- | --- |
| `deep-thinking` | Systematic problem analysis |
| `hypothesis-driven-debugging` | Scientific method for debugging |
| `root-cause-analysis` | 5 Whys, binary search, timeline reconstruction |

### Learning & Growth (6)

How to acquire knowledge and improve over time.

| Instruction | What It Does |
| --- | --- |
| `bootstrap-learning` | Domain-agnostic knowledge acquisition |
| `learning-psychology` | Partnership-based learning |
| `knowledge-coverage` | Confidence calibrated to coverage depth |
| `skill-building` | Create reusable skills from experience |
| `meditation` | Knowledge consolidation protocol |
| `brain-design` | Cognitive architecture principles |

### Planning & Research (2)

| Instruction | What It Does |
| --- | --- |
| `creative-loop` | IDEATE → PLAN → BUILD → TEST → RELEASE → IMPROVE |
| `research-validation` | Validate against authoritative sources |

### Memory (5)

Managing context across sessions.

| Instruction | What It Does |
| --- | --- |
| `memory-curation` | Token-efficient memory management |
| `memory-triggers` | When to create/update memories |
| `pii-memory-filter` | Prevent PII in persistent storage |
| `proactive-awareness` | Cross-session context recovery |
| `session-health-monitoring` | Context window management |

### Ethics (4)

Ethical reasoning from genuine conviction.

| Instruction | What It Does |
| --- | --- |
| `worldview-integration` | Ethical reasoning framework |
| `worldview-constitutional-ai` | Constitutional AI alignment |
| `worldview-moral-psychology` | Moral psychology foundations |
| `privacy-responsible-ai` | Privacy by design principles |

### Meta & Interaction (3)

| Instruction | What It Does |
| --- | --- |
| `emotional-intelligence` | Detect frustration, celebrate success |
| `terminal-command-safety` | Safe command execution |
| `epistemic-calibration` | Confidence matching, hallucination prevention |

### Converters & Mall (6)

Document conversion trifectas + the bridge to optional add-ons.

| Instruction | What It Does |
| --- | --- |
| `markdown-mermaid` | Markdown + Mermaid diagram rendering rules |
| `md-to-html` | Convert Markdown to standalone HTML |
| `md-to-word` | Convert Markdown to .docx with style presets |
| `md-to-eml` | Convert Markdown to email (.eml) |
| `docx-to-md` | Convert Word to Markdown |
| `mall-installation` | How heirs install skills/configs/MCP from Alex_Skill_Mall |

---

## Quick Start

ACT Edition is bootstrapped into your repo, not cloned as a template. The bootstrap script writes the brain, registers your repo in your fleet registry, and sets up the upgrade channel.

### New Repo

```powershell
# 1. Create your repo and cd into it
mkdir my-project; cd my-project; git init
git remote add origin https://github.com/<you>/my-project.git  # optional but recommended

# 2. Clone Edition somewhere outside your repo
git clone --depth 1 https://github.com/fabioc-aloha/Alex_ACT_Edition.git $env:TEMP\edition

# 3. Bootstrap the brain into your repo (--heir-id required; --heir-name/--repo-url/--owner recommended)
node $env:TEMP\edition\.github\scripts\bootstrap-heir.cjs --target . --heir-id my-project --apply
```

### Already Cloned the Template? Use `/initialize`

If you copied or cloned Edition's content into a workspace without running `bootstrap-heir.cjs`, the workspace is *not* a registered heir — it has the brain content but no `.github/.act-heir.json` marker, so `fleet-inventory` can't see it and `upgrade-self.cjs` will refuse. Open the workspace in VS Code with Copilot and run `/initialize`. The prompt detects whether the workspace is fresh, partially installed and clean, or partially installed with local modifications, and runs the right path (full bootstrap or path-1 quick register).

### Migrating an Existing Alex Heir

If you have an older Alex-flavored heir (with the master/inheritable/custom tier model), use the migration tool that ships at the root of this repo. It snapshots the old `.github/`, classifies files via frontmatter (master-tier files dropped, custom files routed to `local/`), installs Edition, and registers the heir.

```powershell
cd <your-heir-repo>
node <path-to>/migrate-to-edition.cjs              # dry-run, see the triage plan
node <path-to>/migrate-to-edition.cjs --apply      # snapshot old brain + install Edition
```

Then in a chat session inside the migrated heir: run the `/finalize-migration` prompt to do the semantic pass over remaining custom content.

See [MIGRATION.md](MIGRATION.md) for the full migration guide — auto-detection, triage rules, failure recovery, and what's intentionally lost.

### After Bootstrap

Open the heir in VS Code with Copilot. Run `/welcome` for orientation. The brain is active.

---

## What Else Ships

Beyond the instructions, the brain bundles:

| Surface | Purpose |
| --- | --- |
| **Skills** (`.github/skills/`) | Document conversion (md ↔ html, docx, eml, word), markdown-mermaid, banner generation |
| **Prompts** (`.github/prompts/`) | Slash-prompts for setup, daily ops, skill discovery, memory, and maintenance (see [Commands](#commands)) |
| **Muscles** (`.github/muscles/`) | Converter executables, `heir-doctor.cjs` (manifest-driven health check), `audit-api-drift.cjs` (external-API freshness), `generate-banner.cjs` (SVG banners) |
| **Configs** (`.github/config/`) | `sync-policy.json`, `edition-manifest.json` (release-time skill+prompt allowlist), `markdown-light.css`, heir-owned `cognitive-config.json` + `goals.json` |
| **Scripts** (`.github/scripts/`) | `bootstrap-heir.cjs`, `upgrade-self.cjs`, `build-edition-manifest.cjs` (regenerates the allowlist), shared `_registry.cjs` |
| **Workspace defaults** (`.vscode/`) | `extensions.json` + `settings.json` shipped as heir-owned templates — new heirs receive them at bootstrap; existing heirs keep their own |
| **Registry** (`.github/EXTERNAL-API-REGISTRY.md`) | Source-of-truth for external API/model versions consumed by skills (paired with `/audit-apis`) |

### Heir-Owned Customization Slots

Edition reserves `local/` subdirectories that survive every upgrade:

```text
.github/instructions/local/  ← your project-specific instructions
.github/skills/local/        ← your custom skills
.github/prompts/local/       ← your custom prompts
.github/muscles/local/       ← your automation scripts
.github/config/local/        ← your tool configs
.github/copilot-instructions.local.md  ← your identity layer
```

The `sync-policy.json` declares these heir-owned. Adding a custom skill to `local/` is permanent; adding it to `.github/skills/` will be wiped on next `upgrade-self.cjs --apply`.

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
- **[Alex_Skill_Mall](https://github.com/fabioc-aloha/Alex_Skill_Mall)** — public catalog of optional skills, patterns, MCP configs, scaffolds, and tool configs. Browse, copy what you need into `local/` slots. Edition's `mall-installation` instruction documents the install pattern.

---

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

---

## Building on ACT

The brain uses a **trifecta pattern** for extensibility:

| Artifact | Purpose | Location |
| --- | --- | --- |
| **Skill** | Domain knowledge | `.github/skills/<name>/SKILL.md` |
| **Instruction** | Behavior trigger | `.github/instructions/<name>.instructions.md` |
| **Muscle** | Automation script | `.github/muscles/<name>.cjs` |

Start with a skill (knowledge). Add an instruction if you need it to auto-load. Add a muscle when automation is worth it.

---

## Philosophy

ACT is not about making AI "smarter" — it's about making AI **honest**.

A confident wrong answer is worse than an uncertain correct answer. ACT shifts the default from "sound authoritative" to "show your work." When the AI doesn't know, it says "I don't know." When it's uncertain, it quantifies the uncertainty. When it challenges your framing, it explains why.

This isn't slower — it's faster in the long run. Debugging a confident hallucination takes hours. Verifying a well-reasoned hypothesis takes minutes.

---

## License

MIT — Use freely, build thoughtfully.

---

> Challenge what you think is right through structured skepticism.
