# ACT Edition for Claude Code

**Artificial Critical Thinking for Anthropic's Claude Code**

[Claude Code](https://claude.ai/code) is Anthropic's agentic coding tool that lets Claude work directly in your terminal and editor. It can edit files, run commands, search your codebase, and manage git — all with Claude's reasoning capabilities.

This package adds **ACT (Artificial Critical Thinking)** — a cognitive architecture that teaches Claude to challenge its own assumptions, generate alternatives, and show its reasoning.

---

## Claude Code Native Capabilities

Claude Code brings powerful agentic features out of the box:

| Capability | What It Does |
|------------|--------------|
| **File editing** | Create, modify, and refactor code directly |
| **Terminal access** | Run commands, install packages, execute tests |
| **Codebase search** | Find symbols, grep for patterns, understand structure |
| **Git integration** | Commit, branch, diff, and manage version control |
| **Multi-file reasoning** | Understand relationships across your codebase |
| **Extended thinking** | Deep reasoning for complex problems |

**Official site**: [claude.ai/code](https://claude.ai/code)

---

## What ACT Adds

Claude Code is capable. ACT makes it **disciplined**.

| Without ACT | With ACT |
|-------------|----------|
| Confident answers that may be wrong | Calibrated confidence with uncertainty markers |
| First solution proposed | Multiple hypotheses generated and compared |
| Assumes your framing is correct | Challenges framing when evidence suggests otherwise |
| Hidden reasoning | Visible markers showing the thinking process |

### The 10 ACT Tenets

| # | Tenet | What Claude Does Differently |
|---|-------|------------------------------|
| I | Hypothesis Primacy | States the hypothesis before gathering evidence |
| II | Disconfirmation | Actively seeks evidence against its conclusions |
| III | Multiple Hypotheses | Generates at least two alternatives before committing |
| IV | System Skepticism | Treats instructions as hypotheses, not commands |
| V | Calibrated Confidence | Says "I don't know" when uncertain |
| VI | Materiality Gate | Applies rigor proportional to stakes |
| VII | Frame Before Solve | Understands the problem before proposing solutions |
| VIII | Adversarial Probe | Steelmans counter-arguments |
| IX | Visible Markers | Shows reasoning, not just conclusions |
| X | Self-Application | Applies ACT to its own reasoning |

---

## Installation

```bash
# From the Alex_ACT_Edition root
cp -r platforms/claude/* /path/to/your/project/

# Or clone and copy
git clone https://github.com/fabioc-aloha/Alex_ACT_Edition.git
cp -r Alex_ACT_Edition/platforms/claude/* /path/to/your/project/
```

This copies:
- `CLAUDE.md` — Claude Code configuration with ACT identity
- `.github/` — Full cognitive architecture (51 instructions)

---

## How ACT Works in Claude Code

Claude Code reads `CLAUDE.md` at the project root. ACT's config file:

1. **Defines identity** — Tells Claude it has critical thinking built in
2. **Points to instructions** — Directs Claude to read `.github/instructions/` for specific behaviors
3. **Sets safety imperatives** — Establishes non-negotiable rules (commit before risky ops, ask before destructive actions)

### Key Instructions to Read

Claude should read these before complex tasks:

**Always relevant:**
- `.github/instructions/act-foundations.instructions.md` — The 10 tenets
- `.github/instructions/critical-thinking.instructions.md` — Challenge assumptions
- `.github/instructions/epistemic-calibration.instructions.md` — Know your confidence

**When debugging:**
- `.github/instructions/hypothesis-driven-debugging.instructions.md`
- `.github/instructions/root-cause-analysis.instructions.md`

**When planning:**
- `.github/instructions/problem-framing-audit.instructions.md`
- `.github/instructions/requirements-analysis.instructions.md`

---

## ACT Delivery: Manual Read

Unlike GitHub Copilot (which auto-loads instructions via `applyTo` patterns), Claude Code requires the agent to read instruction files explicitly.

**How it works:**
1. `CLAUDE.md` tells Claude that instructions exist in `.github/instructions/`
2. Before complex tasks, Claude reads the relevant instruction files
3. The instruction content shapes Claude's behavior for that task

**Example prompt:**
> "Read `.github/instructions/act-pass.instructions.md` and then help me debug why the tests are failing"

Claude will apply the 7-step ACT pass to the debugging task.

---

## What's Included

```
.github/
├── copilot-instructions.md    # Identity (also read by Claude)
├── ABOUT.md                   # Architecture overview
├── episodic/                  # Session memory
│   └── calibration-log.md     # Track confidence over time
└── instructions/              # 51 cognitive instructions
    ├── act-foundations.instructions.md
    ├── act-pass.instructions.md
    ├── critical-thinking.instructions.md
    └── ... (48 more)

CLAUDE.md                      # Claude Code configuration
```

---

## Token Budget

| Component | Tokens |
|-----------|--------|
| CLAUDE.md | ~400 |
| 51 instructions | ~48,000 |
| Episodic memory | ~800 |
| **Total available** | **~49,200** |

Claude Code has generous context limits. ACT uses about 50K tokens when fully loaded, leaving substantial room for your codebase context.

---

## Best Practices for Claude Code + ACT

1. **Start sessions with identity**: Ask Claude to read `CLAUDE.md` first
2. **Load instructions for the task**: Before debugging, have Claude read the debugging instructions
3. **Use visible markers**: Ask Claude to show its reasoning with ACT markers
4. **Track calibration**: Use `.github/episodic/calibration-log.md` to record confidence accuracy

---

## Comparison with Other Platforms

| Feature | Claude Code | GitHub Copilot |
|---------|-------------|----------------|
| Full 51 instructions | ✅ | ✅ |
| Auto-load by context | ❌ Manual | ✅ Via `applyTo` |
| Extended thinking | ✅ Native | ❌ |
| Terminal access | ✅ Native | ⚡ Via tools |
| File editing | ✅ Native | ✅ Native |

Claude Code's extended thinking capabilities complement ACT's structured reasoning — use both for complex problems.

---

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
