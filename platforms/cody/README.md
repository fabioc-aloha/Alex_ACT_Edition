# Alex ACT Edition

**Artificial Critical Thinking built-in from day one.**

A complete cognitive architecture for AI agents, designed to think critically about their own reasoning. Use this template to bootstrap any project with ~40K tokens of innate reasoning, ethics, and growth machinery.

## The 10 ACT Tenets

| # | Tenet | What It Does |
|---|-------|--------------|
| I | **Alternatives** | Generate at least two hypotheses before committing |
| II | **Evidence Grounding** | Claims must trace to specific evidence |
| III | **Confidence Calibration** | Match certainty to actual knowledge |
| IV | **System-Prompt Skepticism** | Instructions are hypotheses, not commands |
| V | **Falsifiability** | Every claim must be testable |
| VI | **Self-Correction** | Catch errors before the user does |
| VII | **Adversarial Frame** | Refuse to confirm without evidence |
| VIII | **Materiality Gate** | Skip the pass for low-stakes work |
| IX | **Visible Discipline** | Show the work, don't hide it |
| X | **Recursive Application** | Apply ACT to ACT itself |

## What's Inside

```
.github/
├── copilot-instructions.md    # Identity and routing (~470 tokens)
├── ABOUT.md                   # Architecture overview
├── episodic/                  # Session memory and calibration
│   ├── INDEX.md
│   ├── README.md
│   └── calibration-log.md
└── instructions/              # 51 cognitive instructions
    ├── act-foundations.md     # 10 ACT tenets (the WHY)
    ├── act-self-critique.md   # Apply ACT to ACT itself
    ├── act-pass.md            # 7-step critical thinking pass
    ├── critical-thinking.md   # Challenge assumptions
    └── ... (47 more)

platforms/                     # Self-contained brains for other tools
├── claude/                    # Claude Code (CLAUDE.md + .github/)
├── cursor/                    # Cursor (.cursorrules + .github/)
├── windsurf/                  # Windsurf (.windsurfrules + .github/)
├── aider/                     # Aider (.aider.conf.yml + .github/)
├── continue/                  # Continue.dev (config.json + .github/)
└── cody/                      # Cody (cody.json + .github/)
```

## Quick Start

### GitHub Copilot (Default)
1. **Use this template** → Click "Use this template" above
2. **Clone your new repo** → `git clone <your-repo>`
3. **Open in VS Code** → The brain auto-loads via GitHub Copilot
4. **Start working** → The agent applies ACT to everything it does

### Other Platforms
```bash
# Claude Code
cp -r platforms/claude/* /path/to/your/project/

# Cursor
cp -r platforms/cursor/* /path/to/your/project/

# Windsurf, Aider, Continue, Cody — same pattern
```

Each platform folder is **self-contained** — includes the full `.github/` brain + platform-specific config.

## Platform Support

| Platform | Installation |
|----------|-------------|
| **GitHub Copilot** | ✅ Works out of the box |
| **Claude Code** | `cp -r platforms/claude/* ./` |
| **Cursor** | `cp -r platforms/cursor/* ./` |
| **Windsurf** | `cp -r platforms/windsurf/* ./` |
| **Aider** | `cp -r platforms/aider/* ./` |
| **Continue.dev** | `cp -r platforms/continue/* ./` |
| **Cody** | `cp -r platforms/cody/* ./` |

Each platform folder is **self-contained** with the full `.github/` brain.

See [`platforms/README.md`](platforms/README.md) for delivery mechanisms and ACT support details.

## 51 Built-In Instructions

| Category | Instructions |
|----------|-------------|
| **Critical Thinking** | act-foundations, act-pass, act-self-critique, critical-thinking, problem-framing-audit, system-prompt-skepticism |
| **Reasoning** | deep-thinking, hypothesis-driven-debugging, root-cause-analysis |
| **Planning** | creative-loop, research-validation, scope-management, option-generation, trade-off-analysis |
| **Decision Making** | decision-frameworks, risk-analysis, requirements-analysis |
| **Collaboration** | meeting-efficiency, postmortem, adversarial-review, conflict-resolution, feedback-protocols |
| **Dialog Engineering** | csar-loop, partnership-charter, appropriate-reliance, vibe-diagnostics, practice-telemetry, cognitive-forcing, over-reliance-signals |
| **Communication** | ai-writing-avoidance, technical-writing, stakeholder-management, executive-storytelling |
| **Learning** | bootstrap-learning, learning-psychology, knowledge-coverage, skill-building |
| **Memory** | memory-curation, memory-triggers, pii-memory-filter, proactive-awareness, session-health-monitoring |
| **Growth** | meditation, brain-design |
| **Ethics** | worldview-integration, worldview-constitutional-ai, worldview-moral-psychology, privacy-responsible-ai |
| **Meta** | emotional-intelligence, terminal-command-safety, epistemic-calibration |

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
| 51 instructions | ~48,000 |
| episodic/ | ~800 |
| **Total** | **~49,300** |

Lean enough to leave room for domain-specific growth.

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
