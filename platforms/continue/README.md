# ACT Edition for Continue.dev

**Artificial Critical Thinking for the Continue AI Code Assistant**

[Continue](https://continue.dev) is an open-source AI code assistant that runs in VS Code and JetBrains IDEs. It connects to any LLM — Claude, GPT-4, local models, or custom endpoints — giving you AI-assisted coding with full control over the model and data.

This package adds **ACT (Artificial Critical Thinking)** — a cognitive architecture that teaches Continue to challenge its own assumptions, generate alternatives, and show its reasoning.

---

## Continue Native Capabilities

Continue brings flexible AI coding:

| Capability | What It Does |
|------------|--------------|
| **Any LLM** | Connect to Claude, GPT-4, Ollama, or custom endpoints |
| **IDE integration** | Works in VS Code and JetBrains |
| **Tab autocomplete** | Context-aware code suggestions |
| **Chat sidebar** | Conversational AI with code context |
| **@ context providers** | Reference files, docs, terminal, and more |
| **Custom commands** | Define your own slash commands |
| **Open source** | Full transparency, self-hostable |

**Official site**: [continue.dev](https://continue.dev)

---

## What ACT Adds

Continue gives you control. ACT adds **discipline**.

| Without ACT | With ACT |
|-------------|----------|
| Confident answers from any model | Calibrated confidence with uncertainty markers |
| First solution proposed | Multiple approaches considered |
| Assumes your framing is correct | Challenges framing when evidence suggests otherwise |
| Hidden reasoning | Visible markers showing the thinking |

### The 10 ACT Tenets

| # | Tenet | What Continue Does Differently |
|---|-------|--------------------------------|
| I | Hypothesis Primacy | States assumptions before generating code |
| II | Disconfirmation | Seeks edge cases that might break the solution |
| III | Multiple Hypotheses | Offers alternative implementations |
| IV | System Skepticism | Questions whether the approach fits the real need |
| V | Calibrated Confidence | Admits when it's uncertain |
| VI | Materiality Gate | Applies rigor proportional to stakes |
| VII | Frame Before Solve | Clarifies requirements before coding |
| VIII | Adversarial Probe | Considers what could go wrong |
| IX | Visible Markers | Shows reasoning in explanations |
| X | Self-Application | Applies these rules to its own suggestions |

---

## Installation

```bash
# From the Alex_ACT_Edition root
cp -r platforms/continue/* /path/to/your/project/

# Or clone and copy
git clone https://github.com/fabioc-aloha/Alex_ACT_Edition.git
cp -r Alex_ACT_Edition/platforms/continue/* /path/to/your/project/
```

This copies:
- `config.json` — Continue configuration referencing ACT
- `.github/` — Full cognitive architecture (51 instructions)

---

## How ACT Works in Continue

Continue uses `~/.continue/config.json` globally or `.continue/config.json` per-project. ACT works via:

1. **System message** — Defines the ACT identity and core behaviors
2. **Context providers** — Reference instruction files with `@file`
3. **Custom commands** — Slash commands that invoke specific instructions

### Using @ Context Providers

Reference ACT instructions directly in your prompts:

```
@.github/instructions/act-pass.instructions.md

Help me debug why the API returns 500 errors
```

Continue will include the instruction file in context.

### Custom Slash Commands

Add ACT-specific commands to your config:

```json
{
  "customCommands": [
    {
      "name": "act-debug",
      "description": "Debug with ACT methodology",
      "prompt": "Read .github/instructions/hypothesis-driven-debugging.instructions.md and apply it to: {{{ input }}}"
    }
  ]
}
```

Then use: `/act-debug the tests fail intermittently`

---

## ACT Delivery: Context Providers

Continue's @ context providers let you pull instruction files into context:

| Provider | Usage |
|----------|-------|
| `@file` | `@.github/instructions/act-foundations.instructions.md` |
| `@folder` | `@.github/instructions/` (all instructions) |
| `@codebase` | Search instructions by content |

**Example:**
```
@.github/instructions/critical-thinking.instructions.md
@.github/instructions/option-generation.instructions.md

I need to refactor the payment module. What approaches should I consider?
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

config.json                    # Continue configuration
```

---

## Token Budget

| Component | Tokens |
|-----------|--------|
| config.json system message | ~300 |
| 51 instructions | ~48,000 |
| Episodic memory | ~800 |
| **Total available** | **~49,100** |

Continue's token budget depends on your chosen LLM. Claude and GPT-4 handle ACT comfortably.

---

## Best Practices for Continue + ACT

1. **Use @file for instructions**: Pull specific instructions into context
2. **Create custom commands**: Add `/act-debug`, `/act-refactor`, etc.
3. **Configure system message**: Include ACT identity in your config
4. **Choose capable models**: Claude or GPT-4 work best with ACT reasoning

---

## Comparison with Other Platforms

| Feature | Continue | GitHub Copilot |
|---------|----------|----------------|
| Full 51 instructions | ✅ | ✅ |
| Auto-load by context | ❌ Manual | ✅ Via `applyTo` |
| Any LLM | ✅ Native | ❌ |
| Open source | ✅ | ❌ |
| @ file references | ✅ Native | ✅ Native |

Continue's model flexibility + ACT = critical thinking with your preferred LLM.

---

## License

MIT — Use freely, build thoughtfully.

---

*"Challenge what you think is right through structured skepticism."*
