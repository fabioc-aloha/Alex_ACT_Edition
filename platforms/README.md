# Platform Adapters

Pre-built configurations to use Alex ACT Edition across different AI coding tools.

## Fully Supported (Native)

| Platform | Config Location | Instructions |
|----------|-----------------|--------------|
| **GitHub Copilot (VS Code)** | `.github/copilot-instructions.md` | Works out of the box |
| **GitHub Copilot (JetBrains)** | `.github/copilot-instructions.md` | Works out of the box |

## Adapter Installation

### Claude Code
```bash
cp platforms/claude/CLAUDE.md ./CLAUDE.md
```

### Cursor
```bash
cp platforms/cursor/.cursorrules ./.cursorrules
```

### Windsurf (Codeium)
```bash
cp platforms/windsurf/.windsurfrules ./.windsurfrules
```

### Aider
```bash
cp platforms/aider/.aider.conf.yml ./.aider.conf.yml
```

### Continue.dev
```bash
cp platforms/continue/config.json .continue/config.json
```

### Cody (Sourcegraph)
```bash
mkdir -p .cody
cp platforms/cody/cody.json .cody/cody.json
```

## What Each Adapter Does

All adapters:
1. Load the core identity from `copilot-instructions.md`
2. Reference the 27 instructions in `.github/instructions/`
3. Adapt to platform-specific syntax

## Feature Parity Matrix

| Feature | Copilot | Claude | Cursor | Windsurf | Aider | Continue | Cody |
|---------|---------|--------|--------|----------|-------|----------|------|
| Identity loading | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto-load instructions | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `applyTo` patterns | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Memory tiers | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Agent modes | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Episodic memory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Note**: Episodic memory (`.github/episodic/`) works everywhere because it's just markdown files the agent can read/write.

## Manual Instruction Loading

For platforms without auto-load, add to your prompt:

```
Before responding, read these files for context:
- .github/instructions/act-foundations.instructions.md
- .github/instructions/critical-thinking.instructions.md
- .github/instructions/epistemic-calibration.instructions.md
```

Or for the full brain:
```
Read all files in .github/instructions/ before responding.
```
