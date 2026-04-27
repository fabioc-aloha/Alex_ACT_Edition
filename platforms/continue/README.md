# Continue.dev Platform

Self-contained Alex ACT Edition brain for Continue.dev.

## Installation

Copy this entire folder's contents to your project root:

```bash
cp -r platforms/continue/* /path/to/your/project/
```

Then move the config to Continue's location:
```bash
mkdir -p ~/.continue
cp config.json ~/.continue/config.json
```

This gives you:
- `config.json` — Continue configuration (move to `~/.continue/`)
- `.github/` — Full cognitive architecture (27 instructions)

## Verification

After copying, your project should have:
```
your-project/
└── .github/
    ├── copilot-instructions.md
    ├── ABOUT.md
    ├── episodic/
    └── instructions/   # 27 cognitive instructions
```

And Continue config at:
```
~/.continue/config.json
```

## How It Works

Continue.dev reads config.json which:
1. Sets a system message with ACT identity
2. Configures context providers to include instruction files
3. References episodic memory for continuity

## Features

✅ Full ACT brain (27 instructions)
✅ Critical thinking framework
✅ Episodic memory
✅ Session continuity
