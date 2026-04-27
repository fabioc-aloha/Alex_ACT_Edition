# Claude Code Platform

Self-contained Alex ACT Edition brain for Claude Code.

## Installation

Copy this entire folder's contents to your project root:

```bash
cp -r platforms/claude/* /path/to/your/project/
```

This gives you:
- `CLAUDE.md` — Claude Code reads this from project root
- `.github/` — Full cognitive architecture (27 instructions)

## Verification

After copying, your project should have:
```
your-project/
├── CLAUDE.md           # Claude reads this
└── .github/
    ├── copilot-instructions.md
    ├── ABOUT.md
    ├── episodic/
    └── instructions/   # 27 cognitive instructions
```

## How It Works

Claude Code automatically reads `CLAUDE.md` from your project root. That file instructs Claude to read the instruction files in `.github/instructions/` for deeper cognitive capabilities.

## Features

✅ Full ACT brain (27 instructions)
✅ Critical thinking framework
✅ Episodic memory
✅ Session continuity
