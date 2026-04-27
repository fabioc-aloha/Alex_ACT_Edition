# Platform Adapters

Self-contained Alex ACT Edition brain for different AI coding tools.

## Installation

| Platform | Command |
|----------|--------|
| **GitHub Copilot** | ✅ Works out of the box (root `.github/`) |
| **Claude Code** | `cp -r platforms/claude/* /your/project/` |
| **Cursor** | `cp -r platforms/cursor/* /your/project/` |
| **Windsurf** | `cp -r platforms/windsurf/* /your/project/` |
| **Aider** | `cp -r platforms/aider/* /your/project/` |
| **Continue.dev** | `cp -r platforms/continue/* /your/project/` |
| **Cody** | `cp -r platforms/cody/* /your/project/` |

## What Each Platform Contains

Every platform folder includes:

| File | Purpose |
|------|---------|
| `README.md` | Platform-specific installation guide |
| Platform config | `.cursorrules`, `CLAUDE.md`, etc. |
| `.github/` | **Complete brain** (38 instructions, episodic memory) |

## Feature Parity

| Feature | Copilot | Claude | Cursor | Windsurf | Aider | Continue | Cody |
|---------|---------|--------|--------|----------|-------|----------|------|
| Full brain | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto-load instructions | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `applyTo` patterns | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| VS Code memory | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Episodic memory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## ACT Delivery by Platform

| Delivery | Platforms | How It Works |
|----------|-----------|-------------|
| **Auto** | Copilot | `applyTo: "**"` in YAML frontmatter auto-loads instructions |
| **Pre-load** | Aider | `read:` directive loads files into context at startup |
| **Config** | Claude, Cursor, Windsurf, Continue, Cody | Config instructs agent to read `.github/instructions/` files |

All 10 ACT tenets are delivered identically — the mechanism differs, not the coverage.

### Delivery Mechanism Details

**Auto (Copilot)** — VS Code reads `applyTo` in YAML frontmatter, injects matching instructions:
```yaml
applyTo: "**"  # Matches all files → always loads
```

**Pre-load (Aider)** — `read:` directive loads files at startup:
```yaml
read:
  - .github/instructions/act-foundations.instructions.md
```

**Config (others)** — Config file instructs agent to read files:
```markdown
## Required Reading
Before complex tasks, read:
- `.github/instructions/act-foundations.instructions.md`
```

### Full ACT Coverage

All platforms receive the same ACT brain:
- `act-foundations.instructions.md` — The 10 tenets with rationale
- `act-pass.instructions.md` — 7-step critical thinking pass
- `act-self-critique.instructions.md` — Apply ACT to ACT itself (Tenet X)
- `critical-thinking.instructions.md` — Challenge assumptions protocol
- `system-prompt-skepticism.instructions.md` — Tenet IV operationalized

**Note**: Non-Copilot platforms include instructions to manually read relevant `.github/instructions/` files. The agent has access to the full brain — it just needs prompting to use it.
