# Cursor Platform

Self-contained Alex ACT Edition brain for Cursor.

## Installation

Copy this entire folder's contents to your project root:

```bash
cp -r platforms/cursor/* /path/to/your/project/
```

This gives you:
- `.cursorrules` — Cursor reads this from project root
- `.github/` — Full cognitive architecture (27 instructions)

## Verification

After copying, your project should have:
```
your-project/
├── .cursorrules        # Cursor reads this
└── .github/
    ├── copilot-instructions.md
    ├── ABOUT.md
    ├── episodic/
    └── instructions/   # 27 cognitive instructions
```

## How It Works

Cursor automatically reads `.cursorrules` from your project root. That file instructs Cursor to read the instruction files in `.github/instructions/` for deeper cognitive capabilities.

## Features

✅ Full ACT brain (27 instructions)
✅ Critical thinking framework
✅ Episodic memory
✅ Session continuity
