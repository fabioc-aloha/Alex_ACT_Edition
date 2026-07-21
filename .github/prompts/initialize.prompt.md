---
description: "Initialize this workspace as an ACT heir — bootstrap the brain or finish a partial install (path-1 quick register)"
lastReviewed: 2026-05-26
---

# Initialize

Make this workspace a registered ACT heir. Detects the workspace state and runs the right path: full bootstrap on a fresh repo, quick-register when Edition content is already present but the marker is missing.

The marker (`.github/.act-heir.json`) is the *only* file that makes a repo a heir. Without it, fleet-inventory won't see this repo and `upgrade-self.cjs` will refuse to run.

## State Detection

Before any writes, classify the workspace:

| State | Signal | Path |
|---|---|---|
| **A — Fresh** | No `.github/` directory at all | Full bootstrap |
| **B — Existing project, no marker, no conflicts** | Git repository exists, no marker, adoption dry run reports zero conflicts | Adoption transaction |
| **C — Existing project with conflicts** | Git repository exists, no marker, adoption dry run reports path conflicts | Adoption transaction with explicit per-path decisions |
| **D — Already a heir** | `.github/.act-heir.json` exists | Refuse, suggest `/upgrade` |

To detect dirty state in B vs C: run `git status --porcelain .github/` and check whether any reported files match the `EDITION_OWNED` globs inlined in `.github/scripts/_registry.cjs`.

## Inputs to Gather

1. **Edition checkout location**. Look in this order:
   - `/tmp/edition/.github/scripts/bootstrap-heir.cjs`
   - `~/Development/Alex_ACT_Edition/.github/scripts/bootstrap-heir.cjs`
   - Any sibling directory of the current workspace named `Alex_ACT_Edition`
   - If none found, ask the user to run:

     ```bash
     git clone --depth 1 https://github.com/fabioc-aloha/Alex_ACT_Edition.git /tmp/edition
     ```

2. **`heir-id`**. Derive from `git remote get-url origin` (slug after the last `/`, strip `.git`). If no remote, ask the user. Validate: lowercase alphanumeric + hyphens, 2–64 chars.

3. **`heir-name`** (optional, defaults to `heir-id`). Ask once if it differs.

4. **`repo-url`** (optional). Read from git remote.

5. **`owner`** (optional). Parse from `repo-url` (the part before the slug for github.com URLs).

## Path A — Full Bootstrap

```bash
node <edition-path>/.github/scripts/bootstrap-heir.cjs \
  --target . \
  --heir-id <slug> \
  --heir-name "<display name>" \
  --repo-url <url> \
  --owner <handle>
```

1. Run dry-run first (omit `--apply`). Summarize: file count, marker fields.
2. Confirm with user.
3. Re-run with `--apply`.
4. Run `node .github/skills/greeting-checkin/scripts/heir-doctor.cjs` -- must exit 0.
5. **Shared memory**: The bootstrap script auto-resolves the `Alex_ACT_Memory` sibling repo (clone or scaffold). If it reports a scaffold, suggest the user clone the shared memory repo:
   - Run: `git clone https://github.com/fabioc-aloha/Alex_ACT_Memory.git ../Alex_ACT_Memory`
   - Or verify resolution: `node .github/scripts/_registry.cjs --resolve .`
6. Stage but do NOT commit. Suggest commit message: `chore: bootstrap as Alex_ACT_Edition heir`.

## Paths B or C — Existing-Project Adoption

Never run bootstrap against a non-empty existing project. Use the shared,
dry-run-first transaction:

```bash
node <edition-path>/.github/scripts/adopt-edition.cjs \
  --source <edition-path> \
  --target . \
  --profile <vscode|copilot-app> \
  --plan-out .act-adoption-plan.json
```

1. Review creates, identical files, preserved project files, and every conflict.
2. Resolve each conflict explicitly with `--overwrite <path>` or
   `--preserve <path>`; wildcard approval is not allowed.
3. Apply only the exact reviewed plan hash:

   ```bash
   node <edition-path>/.github/scripts/adopt-edition.cjs \
     --apply \
     --plan .act-adoption-plan.json \
     --accept-plan-sha <sha256> \
     [--overwrite <path>] [--preserve <path>]
   ```

4. Run the manifest and selected surface-profile checkers.
5. Review `git diff`; do not auto-commit.
6. Keep the reported backup until the project passes its own tests. Use the
   reported rollback command if any acceptance check fails.

## Path D — Already a Heir

Refuse. Read `.github/.act-heir.json` and report `heir_id` + `edition_version`. Direct the user to `/upgrade` instead.

## Pre-flight Checks (all paths except D)

- Workspace is a git repo (`.git/` exists). If not, suggest `git init` first so `heir-id` can be derived from the remote.
- No active merge or rebase (`git status` shows clean state machine). If mid-conflict, refuse and ask user to resolve first.
- Working tree state (clean vs. dirty) is established before any writes — needed to distinguish path B from path C.

## Refuse if

- The marker already exists (path D).
- The user explicitly disagrees with the chosen path after seeing the dry-run summary.
- Edition checkout cannot be located and the user declines to clone it.
- `heir-id` cannot be derived and the user does not provide one.

## Anti-patterns

- **Don't run bootstrap blindly on path C**. The script overwrites without checking — losing the user's local modifications silently.
- **Don't skip the divergence list on path C**. The whole point of path-1 is *acknowledged* migration debt, not hidden debt.
- **Don't auto-commit**. Bootstrap is a meaningful event; the user picks the message and timing.
- **Don't normalize line endings or run formatters during install**. The bootstrap script handles file copy verbatim; downstream tools will adjust on first edit.

## Why a single prompt for four states?

The states are mechanically distinct (different commands, different safety rails) but operationally one question: *"make this workspace a heir."* Splitting into `/bootstrap` and `/quick-register` would force the user to diagnose state before invoking — that's the prompt's job.

## Would Revise If

Revisit this prompt by **2026-08-26** (90 days) or sooner if any of the following fires: the workflow it invokes ceases to produce its intended output (skill body changed but prompt steps stale); the visible markers / verification steps in its body are consistently skipped; or the slash-command name is no longer discoverable in the prompt picker.
