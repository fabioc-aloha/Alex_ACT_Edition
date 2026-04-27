# Cody (Sourcegraph) Platform

Self-contained Alex ACT Edition brain for Cody.

## Installation

Copy this entire folder's contents to your project root:

```bash
cp -r platforms/cody/* /path/to/your/project/
```

Then set up Cody config:
```bash
mkdir -p .cody
mv cody.json .cody/cody.json
```

This gives you:
- `cody.json` — Cody configuration (move to `.cody/`)
- `.github/` — Full cognitive architecture (27 instructions)

## Verification

After copying, your project should have:
```
your-project/
├── .cody/
│   └── cody.json       # Cody reads this
└── .github/
    ├── copilot-instructions.md
    ├── ABOUT.md
    ├── episodic/
    └── instructions/   # 27 cognitive instructions
```

## How It Works

Cody reads `.cody/cody.json` which:
1. Sets instructions with ACT identity
2. Configures context includes for instruction files
3. References episodic memory for continuity

## Features

✅ Full ACT brain (27 instructions)
✅ Critical thinking framework
✅ Episodic memory
✅ Session continuity
