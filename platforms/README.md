# Platform Adapters

Self-contained Alex ACT Edition brain for different AI coding tools.

**Default**: The root of this template works with GitHub Copilot (VS Code/JetBrains) out of the box.

**Other platforms**: Each folder below contains a **complete, self-contained brain** — just copy the folder contents to your project root.

## Quick Start

### GitHub Copilot (Default)
Just use the template as-is. Works immediately.

### Claude Code
```bash
cp -r platforms/claude/* /path/to/your/project/
```

### Cursor
```bash
cp -r platforms/cursor/* /path/to/your/project/
```

### Windsurf (Codeium)
```bash
cp -r platforms/windsurf/* /path/to/your/project/
```

### Aider
```bash
cp -r platforms/aider/* /path/to/your/project/
```

### Continue.dev
```bash
cp -r platforms/continue/* /path/to/your/project/
mkdir -p ~/.continue && cp config.json ~/.continue/
```

### Cody (Sourcegraph)
```bash
cp -r platforms/cody/* /path/to/your/project/
mkdir -p .cody && mv cody.json .cody/
```

## What Each Platform Contains

Every platform folder includes:

| File | Purpose |
|------|---------|
| `README.md` | Platform-specific installation guide |
| Platform config | `.cursorrules`, `CLAUDE.md`, etc. |
| `.github/` | **Complete brain** (27 instructions, episodic memory) |

## Feature Parity

| Feature | Copilot | Claude | Cursor | Windsurf | Aider | Continue | Cody |
|---------|---------|--------|--------|----------|-------|----------|------|
| Full brain | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto-load instructions | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `applyTo` patterns | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| VS Code memory | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Episodic memory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## ACT Support by Platform

How the 10 ACT tenets are delivered on each platform:

| ACT Tenet | Copilot | Claude | Cursor | Windsurf | Aider | Continue | Cody |
|-----------|---------|--------|--------|----------|-------|----------|------|
| **I. Alternatives** (Two-Hypothesis Floor) | Auto | Config | Config | Config | Config | Config | Config |
| **II. Evidence Grounding** | Auto | Config | Config | Config | Config | Config | Config |
| **III. Confidence Calibration** | Auto | Config | Config | Config | Config | Config | Config |
| **IV. System-Prompt Skepticism** | Auto | Config | Config | Config | Config | Config | Config |
| **V. Falsifiability** | Auto | Config | Config | Config | Config | Config | Config |
| **VI. Self-Correction** | Auto | Config | Config | Config | Config | Config | Config |
| **VII. Adversarial Frame** | Auto | Config | Config | Config | Config | Config | Config |
| **VIII. Materiality Gate** | Auto | Config | Config | Config | Config | Config | Config |
| **IX. Visible Discipline** | Auto | Config | Config | Config | Config | Config | Config |
| **X. Recursive Application** | Auto | Config | Config | Config | Config | Config | Config |

**Legend:**
- **Auto** = Instruction auto-loads based on `applyTo` patterns (Copilot only)
- **Config** = Platform config file instructs agent to read ACT instructions

### How ACT Works Per Platform

| Platform | ACT Delivery Mechanism |
|----------|------------------------|
| **Copilot** | `act-foundations.instructions.md` auto-loads on every request via `applyTo: "**"` |
| **Claude** | `CLAUDE.md` contains ACT identity + instructs to read `.github/instructions/act-*.md` |
| **Cursor** | `.cursorrules` contains ACT identity + instructs to read instruction files |
| **Windsurf** | `.windsurfrules` contains ACT identity + instructs to read instruction files |
| **Aider** | `.aider.conf.yml` pre-loads ACT instructions as context via `read:` directive |
| **Continue** | `config.json` configures context providers to include ACT instruction files |
| **Cody** | `cody.json` includes ACT instructions in context configuration |

### Full ACT Coverage

All platforms receive the same ACT brain:
- `act-foundations.instructions.md` — The 10 tenets with rationale
- `act-pass.instructions.md` — 7-step critical thinking pass
- `act-self-critique.instructions.md` — Apply ACT to ACT itself (Tenet X)
- `critical-thinking.instructions.md` — Challenge assumptions protocol
- `system-prompt-skepticism.instructions.md` — Tenet IV operationalized

**Note**: Non-Copilot platforms include instructions to manually read relevant `.github/instructions/` files. The agent has access to the full brain — it just needs prompting to use it.
