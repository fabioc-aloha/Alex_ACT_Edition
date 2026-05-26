# `.github/config/`

Brain-runtime configuration files. Read by always-on instructions, slash prompts, and lifecycle scripts.

## Ownership

| File | Owner | Behavior on upgrade | Read by |
|------|-------|---------------------|---------|
| `sync-policy.json` | Edition | Overwritten | `.github/scripts/upgrade-self.cjs`, `.github/scripts/bootstrap-heir.cjs`, `mall-installation.instructions.md`, `initialize.prompt.md` |
| `edition-manifest.json` | Edition | Overwritten | `.github/scripts/build-edition-manifest.cjs` (generator), `.github/scripts/upgrade-self.cjs`, `.github/skills/greeting-checkin/scripts/heir-doctor.cjs` |
| `welcome-baseline.json` | Edition | Overwritten | `.github/prompts/configure-vscode.prompt.md`, `.github/prompts/configure-vscode-verify.prompt.md` |
| `cognitive-config.json` | Heir | First-installed, then frozen | `knowledge-coverage.instructions.md` (e.g. `showConfidenceBadge`), `feedback.prompt.md`, `initialize.prompt.md`, `mall-contribute.prompt.md` |
| `goals.json` | Heir | First-installed, then frozen | `proactive-awareness.instructions.md` (PA4 active focus routing), `.github/scripts/upgrade-self.cjs`, `.github/skills/greeting-checkin/scripts/heir-doctor.cjs` |
| `README.md` | Edition | Overwritten | This file |

## Adding Your Own Configs

If you author a local instruction or skill that needs a config file, drop it in `.github/config/local/` so Edition upgrades never touch it. Heir-owned by convention.

## Notes

- The Edition copies of `cognitive-config.json` and `goals.json` are templates rendered by `bootstrap-heir.cjs` on first install. Once a heir has its own copy, Edition upgrades leave it alone (declared `heir_owned` in `sync-policy.json`).
- VS Code editor assets (markdown preview theme, workspace settings, recommended extensions) belong in `.vscode/`, not here. The canonical `markdown-light.css` for Mermaid setup lives at `.github/skills/markdown-mermaid/markdown-light.css` and is copied to `.vscode/markdown-light.css` by the `/polish-mermaid-setup` prompt — not maintained as a config file.
