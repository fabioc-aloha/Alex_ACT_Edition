# GitHub Copilot (Native)

This is the native platform for Alex ACT Edition. No adaptation needed.

## Files Used

| File | Purpose |
|------|---------|
| `.github/copilot-instructions.md` | Identity and routing |
| `.github/instructions/*.md` | Auto-loaded based on `applyTo` patterns |
| `.github/episodic/` | Session memory |

## Features

✅ **Full feature support:**
- Identity auto-loading
- Instruction auto-loading via `applyTo` glob patterns
- VS Code memory tiers (`/memories/`)
- Agent modes (`.github/agents/*.agent.md`)
- Prompt workflows (`.github/prompts/*.prompt.md`)
- Episodic memory

## Installation

Just clone/use the template. Works immediately in VS Code with GitHub Copilot Chat.

```bash
# Using as template
gh repo create my-project --template fabioc-aloha/Alex_ACT_Edition

# Or clone directly
git clone https://github.com/fabioc-aloha/Alex_ACT_Edition.git my-project
```

## JetBrains IDEs

Also works natively in JetBrains IDEs with GitHub Copilot plugin. Same `.github/` structure is read automatically.
