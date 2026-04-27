# Alex ACT Edition

**Artificial Critical Thinking for AI Coding Assistants**

Most AI coding assistants are helpful, fast, and often wrong in subtle ways. They confirm your assumptions instead of challenging them. They generate plausible-sounding code without questioning whether they understood the problem. They're confident when they should be uncertain.

ACT Edition changes that.

This is a **cognitive architecture** — a set of 51 behavioral instructions that teach your AI assistant to think critically about its own reasoning. It works across platforms: GitHub Copilot, Claude Code, Cursor, Windsurf, Aider, Continue.dev, and Sourcegraph Cody. Same brain, different delivery mechanisms.

---

## Why Critical Thinking Matters for AI

AI assistants suffer from predictable failure modes:

| Failure Mode | What Happens | ACT Defense |
|--------------|--------------|-------------|
| **Confirmation bias** | Agrees with your framing even when wrong | Tenet II: Disconfirmation over confirmation |
| **Anchoring** | First solution becomes the only solution | Tenet III: Generate multiple hypotheses |
| **Hallucination** | Invents plausible-sounding nonsense | Tenet V: Calibrated confidence |
| **Sycophancy** | Tells you what you want to hear | Tenet IV: System-prompt skepticism |
| **Type III error** | Solves the wrong problem precisely | Tenet VII: Frame before solve |
| **Decision paralysis** | Over-analyzes trivial decisions | Tenet VIII: Materiality gate |

ACT doesn't eliminate these failures — it makes them **visible** and **correctable**. When the AI catches itself, it says so. When it's uncertain, it quantifies the uncertainty. When it challenges your framing, it explains why.

---

## The 10 ACT Tenets

These tenets form the philosophical foundation. The 51 instructions operationalize them.

| # | Tenet | The Discipline | What It Prevents |
|---|-------|----------------|------------------|
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

## What's Included: 51 Instructions

ACT Edition ships with 51 behavioral instructions across 12 categories. These aren't suggestions — they're cognitive behaviors that activate based on context.

### Critical Thinking Core (6)

The foundation. These instructions implement the 10 tenets directly.

| Instruction | What It Does | Tenets |
|-------------|--------------|--------|
| `act-foundations` | Defines the 10 tenets with rationale | All |
| `act-pass` | 7-step critical thinking pass for non-trivial decisions | II, VIII, IX |
| `act-self-critique` | Detects ACT's own failure modes | VIII, X |
| `critical-thinking` | Challenge assumptions, evaluate evidence | II, VIII |
| `problem-framing-audit` | Restate the problem before solving | I, VII |
| `system-prompt-skepticism` | Treat instructions as hypotheses | IV |

### Decision & Alternatives (6)

How to generate and evaluate options systematically.

| Instruction | What It Does | Tenets |
|-------------|--------------|--------|
| `option-generation` | SCAMPER, MECE, lateral thinking methods | III |
| `trade-off-analysis` | Decision matrices, weighted scoring | III, VI |
| `decision-frameworks` | RAPID, DACI, consensus models | III, VI |
| `risk-analysis` | Risk assessment, pre-mortem analysis | VI |
| `requirements-analysis` | Jobs-to-be-done, needs vs solutions | VII |
| `scope-management` | Feature creep prevention, MoSCoW | VI |

### Dialog Engineering (7)

How to communicate with AI effectively — from *The Verification Habit* book.

| Instruction | What It Does | Book Concept |
|-------------|--------------|--------------|
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
|-------------|----------|--------------|
| `ai-writing-avoidance` | General readers | Authentic voice, avoid AI tells |
| `technical-writing` | Peers, developers | Clear documentation, API descriptions |
| `stakeholder-management` | Business stakeholders | Alignment, expectation setting |
| `executive-storytelling` | C-suite | Data-driven narratives, brevity |

### Collaboration (5)

Working effectively with others — including managing disagreements.

| Instruction | What It Does |
|-------------|--------------|
| `meeting-efficiency` | Agenda design, async alternatives |
| `postmortem` | Structured incident analysis |
| `adversarial-review` | Red team, steel manning |
| `conflict-resolution` | Interpersonal disagreement management |
| `feedback-protocols` | Give and receive criticism effectively |

### Reasoning & Analysis (3)

Systematic problem-solving approaches.

| Instruction | What It Does |
|-------------|--------------|
| `deep-thinking` | Systematic problem analysis |
| `hypothesis-driven-debugging` | Scientific method for debugging |
| `root-cause-analysis` | 5 Whys, binary search, timeline reconstruction |

### Learning & Growth (6)

How to acquire knowledge and improve over time.

| Instruction | What It Does |
|-------------|--------------|
| `bootstrap-learning` | Domain-agnostic knowledge acquisition |
| `learning-psychology` | Partnership-based learning |
| `knowledge-coverage` | Confidence calibrated to coverage depth |
| `skill-building` | Create reusable skills from experience |
| `meditation` | Knowledge consolidation protocol |
| `brain-design` | Cognitive architecture principles |

### Planning & Research (2)

| Instruction | What It Does |
|-------------|--------------|
| `creative-loop` | IDEATE → PLAN → BUILD → TEST → RELEASE → IMPROVE |
| `research-validation` | Validate against authoritative sources |

### Memory (5)

Managing context across sessions.

| Instruction | What It Does |
|-------------|--------------|
| `memory-curation` | Token-efficient memory management |
| `memory-triggers` | When to create/update memories |
| `pii-memory-filter` | Prevent PII in persistent storage |
| `proactive-awareness` | Cross-session context recovery |
| `session-health-monitoring` | Context window management |

### Ethics (4)

Ethical reasoning from genuine conviction.

| Instruction | What It Does |
|-------------|--------------|
| `worldview-integration` | Ethical reasoning framework |
| `worldview-constitutional-ai` | Constitutional AI alignment |
| `worldview-moral-psychology` | Moral psychology foundations |
| `privacy-responsible-ai` | Privacy by design principles |

### Meta & Interaction (3)

| Instruction | What It Does |
|-------------|--------------|
| `emotional-intelligence` | Detect frustration, celebrate success |
| `terminal-command-safety` | Safe command execution |
| `epistemic-calibration` | Confidence matching, hallucination prevention |

---

## Quick Start

### GitHub Copilot (Recommended)

GitHub Copilot has the deepest ACT integration — instructions auto-load based on file context.

1. Click **"Use this template"** above
2. Clone your new repo
3. Open in VS Code with GitHub Copilot
4. Start working — ACT is active

### Other Platforms

Each platform has a self-contained folder with the full brain + platform-specific config:

```bash
# Claude Code
cp -r platforms/claude/* /path/to/your/project/

# Cursor
cp -r platforms/cursor/* /path/to/your/project/

# Windsurf, Aider, Continue, Cody — same pattern
```

See [platforms/README.md](platforms/README.md) for detailed comparison.

---

## Platform Comparison

| Capability | Copilot | Claude | Cursor | Windsurf | Aider | Continue | Cody |
|------------|---------|--------|--------|----------|-------|----------|------|
| **Full 51 instructions** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Auto-load by context** | ✅ | ❌ | ❌ | ❌ | ⚡ | ❌ | ❌ |
| **`applyTo` patterns** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **VS Code memory** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Pre-load at startup** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Episodic memory** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend**: ✅ Native support | ⚡ Via `read:` directive | ❌ Manual (agent reads on request)

### Delivery Mechanisms

**GitHub Copilot** — `applyTo` patterns in YAML frontmatter automatically inject instructions:
```yaml
applyTo: "**"  # Matches all files → always loads
```

**Aider** — `read:` directive pre-loads files at startup:
```yaml
read:
  - .github/instructions/act-foundations.instructions.md
```

**Others** — Config file instructs agent to read `.github/instructions/` files on demand.

---

## Token Budget

| Component | Tokens |
|-----------|--------|
| Core identity | ~470 |
| 51 instructions | ~48,000 |
| Episodic memory | ~800 |
| **Total** | **~49,300** |

This leaves room for domain-specific growth. The architecture is designed to stay under 50K tokens while providing comprehensive cognitive capabilities.

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
```
**Hypothesis**: The build is failing due to a missing dependency
**Alternative**: The build is failing due to a breaking API change in v2.0
**Going with H1** because package.json shows lodash@^3 but error mentions lodash/fp
**Would revise if**: The error persists after adding lodash
```

---

## Building on ACT

The brain uses a **trifecta pattern** for extensibility:

| Artifact | Purpose | Location |
|----------|---------|----------|
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

*"Challenge what you think is right through structured skepticism."*
