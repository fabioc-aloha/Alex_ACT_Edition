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

**Note**: Non-Copilot platforms include instructions to manually read relevant `.github/instructions/` files. The agent has access to the full brain — it just needs prompting to use it.
