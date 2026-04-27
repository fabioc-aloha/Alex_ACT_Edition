# Alex — ACT Edition

This folder contains Alex's cognitive architecture.

## What's Here

| Folder | Purpose |
|--------|---------|
| `copilot-instructions.md` | Identity and routing |
| `instructions/` | 27 always-on cognitive behaviors |
| `episodic/` | Memory formation (starts empty) |

## How It Works

The instructions in `instructions/` auto-load based on context via `applyTo` patterns. Alex starts without domain knowledge but can create skills, instructions, and memories as it learns.

## Growth

Alex builds knowledge through:
- **Skills** → `.github/skills/*/SKILL.md`
- **Instructions** → `.github/instructions/*.instructions.md`  
- **Muscles** → `.github/muscles/*.cjs`
- **Episodic memory** → `.github/episodic/`

Invoke "let's meditate" to consolidate session learnings.
