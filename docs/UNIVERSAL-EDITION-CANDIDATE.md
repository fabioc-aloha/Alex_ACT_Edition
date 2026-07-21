# Universal Edition Candidate Operations

## Status

This is an isolated candidate, not a release. It does not change Edition
`main`, Extension delivery, Marketplace publication, Mall operations, or the
support designation of the GitHub Copilot app.

## Select a Profile

| Profile | Use when | Installs |
| --- | --- | --- |
| `copilot-app` | GitHub Copilot app or Copilot CLI | Core, active prompts, agents, scripts, and no `.vscode` payload |
| `vscode` | VS Code with GitHub Copilot | Core plus VS Code configure prompts, CSS, and workspace templates |

Copilot CLI is an invocation mode of `copilot-app`. Custom agents use
`copilot --agent <name>`. Parent-agent delegation is optional and has a manual
skill fallback.

## Adopt Into an Existing Project

Prerequisites:

- The target is a Git repository.
- No merge or rebase is active.
- The worktree is clean before apply.
- The user has selected `vscode` or `copilot-app`.

Create a read-only plan:

```bash
node <edition>/.github/scripts/adopt-edition.cjs \
  --source <edition> \
  --target . \
  --profile copilot-app \
  --plan-out .act-adoption-plan.json
```

Review `operations`, `conflicts`, `preserved`, `direction`, and `plan_hash`.
Resolve every conflict separately. Then apply the exact plan:

```bash
node <edition>/.github/scripts/adopt-edition.cjs \
  --apply \
  --plan .act-adoption-plan.json \
  --accept-plan-sha <sha256> \
  --preserve <project-owned-path> \
  --overwrite <approved-edition-path>
```

No wildcard conflict approval is accepted. Apply writes a backup manifest under
`.act-backups/` before changing live files. The command does not commit.

## Update, Repair, and Downgrade

Run the same planner against the new source. The signed plan reports `install`,
`upgrade`, `repair`, or `downgrade`. Downgrade apply requires
`--allow-downgrade` in addition to the plan hash.

Keep `.act-backups/` until project checks pass. Uninstall is not enabled in this
candidate; pack lifecycle remains gated by G-01.

## Roll Back

Use the backup directory reported by apply:

```bash
node <edition>/.github/scripts/adopt-edition.cjs \
  --rollback \
  --target . \
  --backup <reported-backup-directory>
```

Rollback removes created paths, restores overwritten bytes, and removes the
backup directory when complete. Injected-failure tests prove automatic rollback
before the command returns an error.

## Diagnostics

```bash
npm test
node .github/scripts/build-edition-manifest.cjs --check
node .github/scripts/check-surface-profile.cjs
node .github/scripts/check-core-templates.cjs
```

The artifact-register checker is a governance-time check and requires the
approved Supervisor candidate review:

```bash
node .github/scripts/check-artifact-register.cjs \
  --manifest <v4.1.0-edition-manifest.json> \
  --register <candidate-artifact-review.md>
```

## Current Limitations

- TC-005 records a lasting interactive `/agent` picker limitation. Direct
  `copilot --agent <name>` is the supported CLI agent path.
- TC-006 passes in a fresh VS Code pilot: Core contract, `plan-and-track`,
  profile prompt, and one agent worked without file changes.
- Parent-agent delegation by repository agent name is not assumed. Direct
  `copilot --agent` works; Core retains a manual skill fallback.
- The Mall installer remains unimplemented. U-10 and G-01 govern any official
  marketplace or pack lifecycle change.
- This candidate has not been released, merged, or installed into a user-owned
  production project.

## Evidence

See [Universal Edition Candidate Result](../test/output/universal-edition-candidate-result.md).
