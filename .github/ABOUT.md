# Alex — ACT Edition

This folder contains Alex's cognitive architecture.

## What's Here

| Folder | Purpose |
|--------|---------|
| `copilot-instructions.md` | Identity and routing |
| `instructions/` | 52 always-on cognitive behaviors |
| `skills/` | Optional reusable workflows (ships with `markdown-mermaid`) |
| `episodic/` | Memory-formation templates (heirs fill these in) |
| `config/sync-policy.json` | Edition-owned vs heir-owned paths for `upgrade-self.cjs` |
| `.act-heir.json` | Heir self-identification marker (rendered by `scripts/bootstrap-heir.cjs`) |

## How It Works

The instructions in `instructions/` auto-load based on context via `applyTo` patterns. Alex starts with the cognitive behaviors and grows project-specific knowledge over time.

## Growth

Alex builds knowledge through:

- **Skills** → `.github/skills/*/SKILL.md`
- **Instructions** → `.github/instructions/*.instructions.md`
- **Muscles** → `.github/muscles/*.cjs` (heirs may add these; Edition ships none)
- **Episodic memory** → `.github/episodic/`

Invoke "let's meditate" to consolidate session learnings.

## Pull-Based Updates

Heirs self-update by running `node scripts/upgrade-self.cjs` from their own repo root. The script clones the latest `Alex_ACT_Edition`, applies edition-owned paths, preserves heir-owned paths, and bumps the marker. Major bumps require `--allow-major`. See [decisions/ADR-002-pull-based-fleet.md](https://github.com/fabioc-aloha/Alex_ACT_Supervisor/blob/main/decisions/ADR-002-pull-based-fleet.md) in the Supervisor repo.
