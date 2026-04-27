# ACT Edition for Aider

**Artificial Critical Thinking for Aider AI Pair Programming**

[Aider](https://aider.chat) is an AI pair programming tool that works in your terminal. It connects to Claude, GPT-4, or local models to help you code — directly editing files in your git repo with automatic commits. It's like having a senior developer in your terminal.

This package adds **ACT (Artificial Critical Thinking)** — a cognitive architecture that teaches Aider to challenge its own assumptions, generate alternatives, and show its reasoning.

---

## Aider Native Capabilities

Aider brings terminal-first AI coding:

| Capability | What It Does |
|------------|--------------|
| **Direct file editing** | AI edits files in your repo directly |
| **Git integration** | Automatic commits with descriptive messages |
| **Multi-model support** | Works with Claude, GPT-4, local models |
| **Voice mode** | Code with voice commands |
| **Repo-wide context** | Understands your entire codebase via repo map |
| **Web scraping** | Pull documentation into context |

**Official site**: [aider.chat](https://aider.chat)

---

## What ACT Adds

Aider is a capable pair programmer. ACT makes it a **disciplined** one.

| Without ACT | With ACT |
|-------------|----------|
| Confident edits that may have bugs | Calibrated confidence with uncertainty markers |
| First solution implemented | Multiple approaches considered |
| Assumes your description is complete | Questions ambiguity before coding |
| Silent reasoning | Visible markers showing the thinking |

### The 10 ACT Tenets

| # | Tenet | What Aider Does Differently |
|---|-------|----------------------------|
| I | Hypothesis Primacy | States assumptions before editing |
| II | Disconfirmation | Seeks edge cases that might break the code |
| III | Multiple Hypotheses | Offers alternative implementations |
| IV | System Skepticism | Questions whether the edit fits the real need |
| V | Calibrated Confidence | Admits when it's uncertain |
| VI | Materiality Gate | Applies rigor proportional to stakes |
| VII | Frame Before Solve | Clarifies requirements before editing |
| VIII | Adversarial Probe | Considers what could go wrong |
| IX | Visible Markers | Shows reasoning in commit messages |
| X | Self-Application | Applies these rules to its own edits |

---

## Installation

```bash
# From the Alex_ACT_Edition root
cp -r platforms/aider/* /path/to/your/project/

# Or clone and copy
git clone https://github.com/fabioc-aloha/Alex_ACT_Edition.git
cp -r Alex_ACT_Edition/platforms/aider/* /path/to/your/project/
```

This copies:
- `.aider.conf.yml` — Aider configuration with ACT-aware settings
- `.github/` — Full cognitive architecture (51 instructions)

---

## How ACT Works in Aider

Aider uses `.aider.conf.yml` for configuration. ACT's unique advantage:

### Pre-loaded Instructions via `read:` Directive

Unlike other platforms, Aider can **pre-load files** at startup:

```yaml
read:
  - .github/copilot-instructions.md
  - .github/instructions/act-foundations.instructions.md
  - .github/instructions/critical-thinking.instructions.md
  - .github/instructions/problem-framing-audit.instructions.md
  - .github/instructions/epistemic-calibration.instructions.md
```

These files are loaded into context automatically when Aider starts. No need to manually ask the AI to read them.

### Auto-commit Messages

Aider auto-commits changes. With ACT, commit messages can include reasoning:

```
feat: Add input validation to user registration

Hypothesis: Missing validation causes the 500 errors on signup
Alternative considered: Rate limiting (rejected - errors occur on first attempt)
Confidence: High - error logs show null pointer on email field
```

---

## ACT Delivery: Pre-load + Manual Read

Aider has the best instruction loading of any non-Copilot platform:

| Method | What Loads |
|--------|------------|
| **`read:` directive** | Core instructions load at startup |
| **In-session `/read`** | Additional instructions on demand |
| **Manual request** | Ask Aider to read specific files |

**Example session:**
```bash
$ aider
# Core ACT instructions already loaded via .aider.conf.yml

> /read .github/instructions/hypothesis-driven-debugging.instructions.md
> The tests are failing intermittently. Help me debug.
```

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

.aider.conf.yml                # Aider configuration with read directives
```

---

## Token Budget

| Component | Tokens |
|-----------|--------|
| Pre-loaded instructions | ~5,000 |
| Remaining 46 instructions | ~43,000 |
| Episodic memory | ~800 |
| **Total available** | **~49,200** |

The `read:` directive pre-loads the most important instructions. Load others as needed with `/read`.

---

## Best Practices for Aider + ACT

1. **Trust the pre-load**: Core ACT instructions load automatically
2. **Use `/read` for specifics**: Load debugging instructions before debugging
3. **Check commit messages**: ACT reasoning should appear in commits
4. **Ask for alternatives**: "Give me two different approaches to this"

---

## Comparison with Other Platforms

| Feature | Aider | GitHub Copilot |
|---------|-------|----------------|
| Full 51 instructions | ✅ | ✅ |
| Auto-load by context | ⚡ Via `read:` | ✅ Via `applyTo` |
| Pre-load at startup | ✅ Best-in-class | ✅ |
| Terminal-first | ✅ Native | ❌ |
| Multi-model support | ✅ Native | ❌ |

Aider's `read:` directive makes it the best non-Copilot platform for ACT instruction loading.

---

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
