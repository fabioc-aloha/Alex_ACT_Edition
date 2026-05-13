# Environment Baseline

Last reviewed: 2026-05-13
Scope: Alex ACT fleet local development environment

## Required

- VS Code stable channel: 1.120.0 or newer
- VS Code update mode: default
- Extensions auto update: enabled
- Node.js: 22.0.0 or newer
- npm: 10.0.0 or newer
- GitHub CLI (`gh`): 2.92.0 or newer
- ripgrep (`rg`): 15.1.0 or newer

## Recommended

- pandoc: 3.8.3 or newer
- Mermaid CLI (`mmdc`): 11.12.0 or newer

## User Settings Policy (Windows)

Apply in `%APPDATA%\\Code\\User\\settings.json`:

```json
{
  "update.mode": "default",
  "extensions.autoUpdate": true,
  "extensions.autoCheckUpdates": true,
  "extensions.autoUpdateOnlyEnabledExtensions": false,
  "mermaid-chat.enabled": true
}
```

## Mermaid Features (Native VS Code)

- Mermaid rendering in chat responses is available in VS Code 1.109+ (`mermaid-chat.enabled`).
- Rendered Markdown preview in diff editors is available in VS Code 1.120+.

Optional diff-only preview setting:

```json
{
  "workbench.diffEditorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  }
}
```

## Quick Verification

```powershell
code.cmd --version
node -v
npm -v
gh --version
rg --version
pandoc --version
mmdc --version
```

## Notes

- Keep preview and experimental VS Code/Copilot features disabled in fleet policy unless explicitly approved.
- Workspace-level `.vscode/settings*.json` should remain absent unless there is a documented exception.
