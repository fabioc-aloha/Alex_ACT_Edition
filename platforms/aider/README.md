# Aider Platform

Self-contained Alex ACT Edition brain for Aider.

## Installation

Copy this entire folder's contents to your project root:

```bash
cp -r platforms/aider/* /path/to/your/project/
```

This gives you:
- `.aider.conf.yml` — Aider configuration with instruction paths
- `.github/` — Full cognitive architecture (27 instructions)

## Verification

After copying, your project should have:
```
your-project/
├── .aider.conf.yml     # Aider reads this
└── .github/
    ├── copilot-instructions.md
    ├── ABOUT.md
    ├── episodic/
    └── instructions/   # 27 cognitive instructions
```

## How It Works

Aider reads `.aider.conf.yml` which:
1. Sets a system prompt with ACT identity
2. Pre-loads key instruction files as context
3. References episodic memory for session continuity

## Features

✅ Full ACT brain (27 instructions)
✅ Critical thinking framework
✅ Episodic memory
✅ Session continuity
