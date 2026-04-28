---
description: "Pull the latest Edition into this heir — dry-run first, plain-English diff summary, ask before applying"
mode: agent
---

# Upgrade

Run `upgrade-self.cjs` safely. Dry-run, summarize, ask, then apply.

## Steps

1. **Verify heir** — confirm `.github/.act-heir.json` exists. If not, refuse and suggest bootstrap.

2. **Dry-run** — execute:

   ```bash
   node .github/scripts/upgrade-self.cjs
   ```

   Capture stdout/stderr.

3. **Summarize the diff** in plain English. Group by category:
   - **Instructions**: N changed, M new, K deleted
   - **Skills**: …
   - **Prompts**: …
   - **Muscles**: …
   - **Scripts** (`upgrade-self.cjs`, `bootstrap-heir.cjs`): if changed, flag as **mechanical changes** — usually safe but worth noting
   - **Version bump**: current → new. If major (e.g., 0.x → 1.x or 1.x → 2.x), flag and remind that `--apply` requires `--allow-major`

4. **Surface anything notable**:
   - Files that would be deleted (heir-owned files should NEVER appear here — if they do, it's a bug, refuse to proceed)
   - Files under `local/` paths in the change list (heir-owned should be untouched — flag as bug)
   - New instructions whose `applyTo` matches files this heir actually has

5. **Ask** — show the summary and ask: "Apply this upgrade? (yes / no / show full diff)"
   - `show full diff` → print the raw dry-run output
   - `yes` → run with `--apply` (and `--allow-major` if it's a major bump)
   - `no` → stop, no changes

6. **Apply** — execute:

   ```bash
   node .github/scripts/upgrade-self.cjs --apply
   # or with --allow-major if needed
   ```

   Confirm marker bumped (`last_sync_at` and `edition_version` updated in `.act-heir.json`).

7. **Stage but do NOT commit** — show `git status` and let the user pick the commit message. Suggest: `chore: upgrade to Edition vX.Y.Z`.

## Refuse if

- The dry-run shows files under `.github/skills/local/`, `.github/instructions/local/`, `.github/muscles/local/`, or `.github/prompts/local/` being changed — that's an Edition bug, not an upgrade
- `.github/.act-heir.json` would be overwritten (it's heir-owned)
- Major bump without explicit user consent
