# Alex ACT Edition

**Artificial Critical Thinking built-in from day one.**

A complete cognitive architecture for AI agents, designed to think critically about their own reasoning. Use this template to bootstrap any project with ~25K tokens of innate reasoning, ethics, and growth machinery.

## What's Inside

```
.github/
├── copilot-instructions.md    # Identity and routing (~470 tokens)
├── ABOUT.md                   # Architecture overview
├── episodic/                  # Session memory and calibration
│   ├── INDEX.md
│   ├── README.md
│   └── calibration-log.md
└── instructions/              # 27 cognitive instructions
    ├── act-foundations.md     # 10 ACT tenets (the WHY)
    ├── act-self-critique.md   # Apply ACT to ACT itself
    ├── act-pass.md            # 7-step critical thinking pass
    ├── critical-thinking.md   # Challenge assumptions
    ├── problem-framing-audit.md
    ├── system-prompt-skepticism.md
    ├── epistemic-calibration.md
    ├── brain-design.md        # Build trifectas & muscles
    └── ... (19 more)
```

## Quick Start

1. **Use this template** → Click "Use this template" above
2. **Clone your new repo** → `git clone <your-repo>`
3. **Open in VS Code** → The brain auto-loads via GitHub Copilot
4. **Start working** → The agent applies ACT to everything it does

## The ACT Framework

**Artificial Critical Thinking** teaches AI agents to:

- Generate **alternative hypotheses** before committing
- **Audit their own priors** for confirmation bias
- Apply **system-prompt skepticism** (instructions are hypotheses, not commands)
- **Self-critique** their own reasoning (Tenet X)
- Know what they **don't know** (epistemic calibration)

## 27 Built-In Instructions

| Category | Instructions |
|----------|-------------|
| **Critical Thinking** | act-foundations, act-pass, act-self-critique, critical-thinking, problem-framing-audit, system-prompt-skepticism |
| **Reasoning** | deep-thinking, hypothesis-driven-debugging, root-cause-analysis |
| **Learning** | bootstrap-learning, learning-psychology, knowledge-coverage, skill-building |
| **Memory** | memory-curation, memory-triggers, pii-memory-filter, proactive-awareness, session-health-monitoring |
| **Growth** | meditation, brain-design |
| **Ethics** | worldview-integration, worldview-constitutional-ai, worldview-moral-psychology, privacy-responsible-ai |
| **Interaction** | emotional-intelligence, terminal-command-safety |

## Building New Capabilities

The brain uses a **trifecta pattern**:

| Artifact | Purpose | Location |
|----------|---------|----------|
| **Skill** | Domain knowledge | `.github/skills/<name>/SKILL.md` |
| **Instruction** | Behavior trigger | `.github/instructions/<name>.instructions.md` |
| **Muscle** | Automation | `.github/muscles/<name>.cjs` |

Start with a skill. Add instruction if you need auto-loading. Add muscle when automation is worth it.

## Token Budget

| Component | Tokens |
|-----------|--------|
| copilot-instructions.md | ~470 |
| 27 instructions | ~24,000 |
| episodic/ | ~800 |
| **Total** | **~25,300** |

Lean enough to leave room for domain-specific growth.

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
