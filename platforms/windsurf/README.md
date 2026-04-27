# Windsurf (Codeium) Platform

Self-contained Alex ACT Edition brain for Windsurf.

## Installation

Copy this entire folder's contents to your project root:

```bash
cp -r platforms/windsurf/* /path/to/your/project/
```

This gives you:
- `.windsurfrules` — Windsurf reads this from project root
- `.github/` — Full cognitive architecture (27 instructions)

## Verification

After copying, your project should have:
```
your-project/
├── .windsurfrules      # Windsurf reads this
└── .github/
    ├── copilot-instructions.md
    ├── ABOUT.md
    ├── episodic/
    └── instructions/   # 27 cognitive instructions
```

## How It Works

Windsurf automatically reads `.windsurfrules` from your project root. That file instructs Windsurf to read the instruction files in `.github/instructions/` for deeper cognitive capabilities.

## Features

✅ Full ACT brain (27 instructions)
✅ Critical thinking framework
✅ Episodic memory
✅ Session continuity
