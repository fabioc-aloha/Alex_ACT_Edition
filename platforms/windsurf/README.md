# ACT Edition for Windsurf

**Artificial Critical Thinking for Codeium's Windsurf Editor**

[Windsurf](https://codeium.com/windsurf) is Codeium's agentic IDE — an AI-first editor that goes beyond autocomplete to provide "Flows" that can plan, execute, and iterate on multi-step tasks. It understands your codebase deeply and can make coordinated changes across files.

This package adds **ACT (Artificial Critical Thinking)** — a cognitive architecture that teaches Windsurf's AI to challenge its own assumptions, generate alternatives, and show its reasoning.

---

## Windsurf Native Capabilities

Windsurf brings agentic coding features:

| Capability | What It Does |
|------------|--------------|
| **Cascade (Flows)** | Multi-step agentic workflows that plan and execute |
| **Deep codebase understanding** | AI indexes and reasons about your entire project |
| **Multi-file edits** | Coordinated changes across many files |
| **Supercomplete** | Context-aware completions beyond single lines |
| **Command palette AI** | Natural language commands for any action |
| **Inline suggestions** | Real-time code generation as you type |

**Official site**: [codeium.com/windsurf](https://codeium.com/windsurf)

---

## What ACT Adds

Windsurf's Flows are powerful. ACT makes them **disciplined**.

| Without ACT | With ACT |
|-------------|----------|
| Flows execute without questioning the plan | Flows verify the plan makes sense first |
| Confident multi-file changes | Changes come with uncertainty markers |
| First approach tried | Multiple approaches considered |
| Silent reasoning | Visible markers showing the thinking |

### The 10 ACT Tenets

| # | Tenet | What Windsurf Does Differently |
|---|-------|--------------------------------|
| I | Hypothesis Primacy | States assumptions before executing Flows |
| II | Disconfirmation | Seeks evidence that the plan might fail |
| III | Multiple Hypotheses | Proposes alternative approaches |
| IV | System Skepticism | Questions whether the Flow fits the real need |
| V | Calibrated Confidence | Admits uncertainty about complex changes |
| VI | Materiality Gate | Applies rigor proportional to impact |
| VII | Frame Before Solve | Clarifies the goal before planning |
| VIII | Adversarial Probe | Considers what could break |
| IX | Visible Markers | Shows reasoning in Flow explanations |
| X | Self-Application | Applies these rules to its own plans |

---

## Installation

```bash
# From the Alex_ACT_Edition root
cp -r platforms/windsurf/* /path/to/your/project/

# Or clone and copy
git clone https://github.com/fabioc-aloha/Alex_ACT_Edition.git
cp -r Alex_ACT_Edition/platforms/windsurf/* /path/to/your/project/
```

This copies:
- `.windsurfrules` — Windsurf configuration with ACT identity
- `.github/` — Full cognitive architecture (51 instructions)

---

## How ACT Works in Windsurf

Windsurf reads `.windsurfrules` at the project root. ACT's config file:

1. **Defines identity** — Tells the AI it has critical thinking built in
2. **Points to instructions** — Directs the AI to read `.github/instructions/` for specific behaviors
3. **Sets safety imperatives** — Establishes non-negotiable rules before executing Flows

### Key Instructions to Read

Ask Windsurf to read these before complex Flows:

**Before any Flow:**
- `.github/instructions/act-foundations.instructions.md` — The 10 tenets
- `.github/instructions/problem-framing-audit.instructions.md` — Verify the plan

**For refactoring Flows:**
- `.github/instructions/option-generation.instructions.md`
- `.github/instructions/risk-analysis.instructions.md`

**For debugging Flows:**
- `.github/instructions/hypothesis-driven-debugging.instructions.md`
- `.github/instructions/root-cause-analysis.instructions.md`

---

## ACT Delivery: Config + Manual Read

Windsurf reads `.windsurfrules` automatically but requires the agent to read instruction files explicitly for detailed behaviors.

**How it works:**
1. `.windsurfrules` establishes the ACT identity
2. Before complex Flows, ask Windsurf to read relevant instructions
3. The instructions shape how the Flow plans and executes

**Example prompt:**
> "Read `.github/instructions/act-pass.instructions.md` then create a Flow to refactor the authentication system"

---

## What's Included

```
.github/
├── copilot-instructions.md    # Identity
├── ABOUT.md                   # Architecture overview
├── episodic/                  # Session memory
│   └── calibration-log.md     # Track confidence over time
└── instructions/              # 51 cognitive instructions
    ├── act-foundations.instructions.md
    ├── act-pass.instructions.md
    ├── critical-thinking.instructions.md
    └── ... (48 more)

.windsurfrules                 # Windsurf configuration
```

---

## Token Budget

| Component | Tokens |
|-----------|--------|
| .windsurfrules | ~400 |
| 51 instructions | ~48,000 |
| Episodic memory | ~800 |
| **Total available** | **~49,200** |

Windsurf's context handling can accommodate ACT while maintaining deep codebase understanding.

---

## Best Practices for Windsurf + ACT

1. **Frame before Flow**: Before starting a Flow, clarify what success looks like
2. **Load instructions for complex Flows**: Read relevant instructions before multi-file changes
3. **Ask for the plan first**: "Show me the Flow plan before executing"
4. **Request alternatives**: "What are two different approaches to this Flow?"

---

## Comparison with Other Platforms

| Feature | Windsurf | GitHub Copilot |
|---------|----------|----------------|
| Full 51 instructions | ✅ | ✅ |
| Auto-load by context | ❌ Manual | ✅ Via `applyTo` |
| Agentic Flows | ✅ Native | ⚡ Via tools |
| Multi-file edits | ✅ Native | ✅ Native |
| Codebase indexing | ✅ Deep | ⚡ Partial |

Windsurf's Flows + ACT's structured reasoning = disciplined agentic coding.

---

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
