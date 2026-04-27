# ACT Edition for Cursor

**Artificial Critical Thinking for the Cursor AI Code Editor**

[Cursor](https://cursor.com) is an AI-first code editor built on VS Code. It features a powerful AI assistant that can edit code, answer questions, and help you understand your codebase — with seamless integration into your editing workflow.

This package adds **ACT (Artificial Critical Thinking)** — a cognitive architecture that teaches Cursor's AI to challenge its own assumptions, generate alternatives, and show its reasoning.

---

## Cursor Native Capabilities

Cursor brings AI-native editing features:

| Capability | What It Does |
|------------|--------------|
| **Cmd+K editing** | Inline AI edits with natural language |
| **Chat sidebar** | Conversational AI with codebase context |
| **Codebase indexing** | AI understands your entire project structure |
| **Multi-file edits** | Apply changes across multiple files at once |
| **Tab completion** | Context-aware code suggestions |
| **@ mentions** | Reference files, symbols, or docs in prompts |

**Official site**: [cursor.com](https://cursor.com)

---

## What ACT Adds

Cursor's AI is fast and capable. ACT makes it **disciplined**.

| Without ACT | With ACT |
|-------------|----------|
| Confident code that may have bugs | Calibrated confidence with uncertainty markers |
| First solution proposed | Multiple approaches generated and compared |
| Assumes your framing is correct | Challenges framing when evidence suggests otherwise |
| Hidden reasoning | Visible markers showing the thinking process |

### The 10 ACT Tenets

| # | Tenet | What Cursor's AI Does Differently |
|---|-------|-----------------------------------|
| I | Hypothesis Primacy | States the hypothesis before generating code |
| II | Disconfirmation | Seeks edge cases that might break the solution |
| III | Multiple Hypotheses | Offers alternative implementations |
| IV | System Skepticism | Questions whether the approach fits the real need |
| V | Calibrated Confidence | Admits when it's uncertain about behavior |
| VI | Materiality Gate | Applies rigor proportional to stakes |
| VII | Frame Before Solve | Clarifies requirements before coding |
| VIII | Adversarial Probe | Considers what could go wrong |
| IX | Visible Markers | Shows reasoning in comments and explanations |
| X | Self-Application | Applies these rules to its own suggestions |

---

## Installation

```bash
# From the Alex_ACT_Edition root
cp -r platforms/cursor/* /path/to/your/project/

# Or clone and copy
git clone https://github.com/fabioc-aloha/Alex_ACT_Edition.git
cp -r Alex_ACT_Edition/platforms/cursor/* /path/to/your/project/
```

This copies:
- `.cursorrules` — Cursor configuration with ACT identity
- `.github/` — Full cognitive architecture (51 instructions)

---

## How ACT Works in Cursor

Cursor reads `.cursorrules` at the project root. ACT's config file:

1. **Defines identity** — Tells the AI it has critical thinking built in
2. **Points to instructions** — Directs the AI to read `.github/instructions/` for specific behaviors
3. **Sets safety imperatives** — Establishes non-negotiable rules

### Key Instructions to Read

Ask Cursor to read these before complex tasks:

**Always relevant:**
- `.github/instructions/act-foundations.instructions.md` — The 10 tenets
- `.github/instructions/critical-thinking.instructions.md` — Challenge assumptions
- `.github/instructions/epistemic-calibration.instructions.md` — Know your confidence

**When refactoring:**
- `.github/instructions/option-generation.instructions.md`
- `.github/instructions/trade-off-analysis.instructions.md`

**When debugging:**
- `.github/instructions/hypothesis-driven-debugging.instructions.md`
- `.github/instructions/root-cause-analysis.instructions.md`

---

## ACT Delivery: Config + Manual Read

Cursor reads `.cursorrules` automatically but requires the agent to read instruction files explicitly for detailed behaviors.

**How it works:**
1. `.cursorrules` establishes the ACT identity and core behaviors
2. Before complex tasks, ask Cursor to read the relevant instruction files
3. The instruction content shapes behavior for that task

**Example prompt:**
> "@.github/instructions/act-pass.instructions.md Apply this to help me refactor the authentication module"

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

.cursorrules                   # Cursor configuration
```

---

## Token Budget

| Component | Tokens |
|-----------|--------|
| .cursorrules | ~400 |
| 51 instructions | ~48,000 |
| Episodic memory | ~800 |
| **Total available** | **~49,200** |

Cursor's context window can handle ACT comfortably while leaving room for your codebase.

---

## Best Practices for Cursor + ACT

1. **Use @ mentions**: Reference instruction files directly with `@.github/instructions/...`
2. **Load instructions for the task**: Before complex work, mention the relevant instruction file
3. **Ask for alternatives**: "Give me two different approaches to this problem"
4. **Request visible reasoning**: "Show me your thinking with ACT markers"

---

## Comparison with Other Platforms

| Feature | Cursor | GitHub Copilot |
|---------|--------|----------------|
| Full 51 instructions | ✅ | ✅ |
| Auto-load by context | ❌ Manual | ✅ Via `applyTo` |
| Cmd+K inline editing | ✅ Native | ❌ |
| Codebase indexing | ✅ Native | ⚡ Partial |
| @ file mentions | ✅ Native | ✅ Native |

Cursor's Cmd+K editing and codebase indexing complement ACT's structured reasoning beautifully.

---

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
