# Migrating an Existing Heir to Alex ACT Edition

If you have an older Alex-flavored repo (with the master/inheritable/custom inheritance tier model) and want to move it to ACT Edition's simpler edition-vs-`local/` ownership model, this is the path.

## What `migrate-to-edition.cjs` Does

A two-phase migration: the script handles deterministic, mechanical work; a chat prompt handles the semantic judgment work.

```text
node migrate-to-edition.cjs --apply    →    /finalize-migration
       (mechanical)                          (semantic)
```

The script alone gets you to "heir is on Edition v0.3.x, doctor exits 0." The chat prompt finishes the migration by extracting your identity content and porting custom artifacts into `local/` slots.

## Mechanical Phase (the Script)

```powershell
# From inside the heir repo you want to migrate
cd <heir-repo>
node <path-to>/migrate-to-edition.cjs              # dry-run, see the plan
node <path-to>/migrate-to-edition.cjs --apply      # execute
```

The script lives at the root of [Alex_ACT_Edition](https://github.com/fabioc-aloha/Alex_ACT_Edition) and mirrored in [Alex_ACT_Supervisor](https://github.com/fabioc-aloha/Alex_ACT_Supervisor). Either copy is fine — they're identical.

### Auto-Detection

If the heir has a GitHub `origin` remote, all identity fields are derived automatically:

| Field | Source | Example |
|-------|--------|---------|
| `--heir-id` | repo name slugified | `FabricCapacity` → `fabric-capacity` |
| `--owner` | first path segment of remote | `fabioc-aloha` |
| `--repo-url` | normalized HTTPS URL | `https://github.com/fabioc-aloha/FabricCapacity` |
| `--heir-name` | repo name as-is | `FabricCapacity` |

Each field is tagged `[auto]` or `[override]` in the banner so you can see what was detected. Override any field with the corresponding flag.

The slugifier handles camelCase, PascalCase, underscores, dots, and acronym boundaries:

| Input | Slug |
|-------|------|
| `FabricCapacity` | `fabric-capacity` |
| `Alex_ACT_Edition` | `alex-act-edition` |
| `AlexACTSupervisor` | `alex-act-supervisor` |
| `CRMIntegration` | `crm-integration` |
| `my.repo.name` | `my-repo-name` |

### Pre-Flight

The script refuses to run if:

- The cwd has no `.github/` (this isn't an Alex heir)
- `.github/.act-heir.json` already exists (this heir is already on Edition — use `upgrade-self.cjs` instead)
- The heir-id is invalid (must be lowercase alphanumeric + hyphens, 2–64 chars)

A missing `--owner` is a warning, not an error.

### Triage Classification

Before any files move, the script inventories `.github/` and classifies every file into one of six buckets. The bucket counts are printed before the dry-run pauses.

| Bucket | What goes here | Action |
|--------|----------------|--------|
| **drop (extension-only)** | `agents/`, `hooks/`, `episodic/`, extension-UI configs (`loop-menu.json`, `taglines.json`, `MASTER-ALEX-PROTECTED.json`, etc.), schema files, `*-template.json` | dropped (Edition has no consumer) |
| **drop (replaced by Edition)** | Instructions/skills/prompts whose name matches what Edition ships (`critical-thinking`, `epistemic-calibration`, `markdown-mermaid`, `welcome`, etc.) | dropped (Edition's version wins) |
| **drop (master-tier inherited)** | Files with frontmatter `inheritance: inheritable` or `inheritance: master-only`; muscles with JSDoc `@inheritance inheritable` or `master-only` | dropped (was AlexMaster fleet content, not custom heir work) |
| **extract identity from** | `copilot-instructions.md` | mined for identity content in the semantic pass, then dropped |
| **port to local/ (manual)** | Anything else under `instructions/`, `skills/`, `prompts/`, `muscles/` that doesn't match the rules above | candidate for porting into `.github/<surface>/local/` during the semantic pass |
| **review (uncertain)** | Anything that didn't match a rule | shown separately so you can decide case-by-case |

The triage table prints the first 20 port-to-local entries with their planned `.github/<surface>/local/` destinations. If you have more, the count is shown.

**Frontmatter awareness is what makes this useful.** Without it, every old AlexMaster instruction would land in "port to local/" and you'd have 50+ files to triage. With it, the bucket usually shrinks to under 15.

### Apply Steps

When run with `--apply`, the script executes five steps:

1. **Snapshot** — `.github/` → `.github-old-YYYY-MM-DD/` (renamed, not deleted; rolled back automatically if any later step fails)
2. **Clone Edition** — shallow clone of Edition into `%TEMP%/edition-migrate-*/`
3. **Bootstrap** — runs Edition's `bootstrap-heir.cjs --target . --apply` against the heir cwd. Writes the new brain, the `.act-heir.json` marker, the identity template at `copilot-instructions.local.md`, the heir-owned config templates, and registers the heir in your shared `AI-Memory/heirs/registry.json`.
4. **Verify** — runs `heir-doctor.cjs`. Should exit 0 with informational notes about empty `local/` directories.
5. **Print hand-off** — banner directing you to run `/finalize-migration` in a chat session for the semantic pass.

The temp clone is cleaned up on success.

### Failure Recovery

The atomic snapshot is the safety net:

| If this fails | Behavior |
|---------------|----------|
| Network during clone (step 2) | Snapshot is renamed back to `.github/` automatically — your old brain is restored as if nothing happened |
| Bootstrap (step 3) | Snapshot is preserved at `.github-old-YYYY-MM-DD/`. Recover manually: `Remove-Item .github -Recurse; Rename-Item .github-old-YYYY-MM-DD .github` |
| Doctor (step 4) | Migration is technically complete but flagged. Read the doctor output and fix |

The snapshot folder is **not deleted** on success. It travels with the migration commit so you can mine it for content later or recover from it.

## Semantic Phase (`/finalize-migration`)

After the script's apply succeeds, open a chat session in the migrated heir and run:

```text
/finalize-migration
```

This runs the prompt at `.github/prompts/finalize-migration.prompt.md`. The prompt walks five passes:

1. **Identity Extraction** — reads the old `copilot-instructions.md` from the snapshot, classifies each section as identity / architecture / mixed, ports identity content into `copilot-instructions.local.md`.
2. **Custom Content Port** — for each file in the triage's "port to local/" bucket: read it, decide if it's still relevant (some custom content targeted removed primitives like agents or hooks — drop those), strip old `inheritance:` frontmatter, fix any references to dropped surfaces, copy into the appropriate `local/` slot.
3. **Review Bucket** — same as Pass 2 but for files the script couldn't classify confidently.
4. **Verification** — re-runs `heir-doctor.cjs`, dry-runs `upgrade-self.cjs` to confirm none of your `local/` files appear in the diff (which would mean you put them in the wrong path).
5. **Commit** — single migration commit including the `.github-old-*/` snapshot for one or two weeks of insurance.

The semantic pass is judgment work. Don't try to automate it — frontmatter classification only goes so far.

## After Migration: Ongoing Maintenance

Once `migrate-to-edition.cjs` and `/finalize-migration` are done, **the heir is on Edition**. Migration is a one-time event, not a recurring tool.

From here on, you pull updates the same way every other Edition heir does:

```text
/upgrade
```

That prompt runs `upgrade-self.cjs` in dry-run mode, summarizes the diff in plain English (instructions/skills/prompts/muscles/scripts changed, new, deleted, plus version bump), and asks before applying. It is the **only** maintenance tool you need going forward.

| When to use what | Tool |
|------------------|------|
| First time installing Edition into an old Alex heir | `migrate-to-edition.cjs` (one-time) |
| Just-finished migration, polishing custom content | `/finalize-migration` (one-time) |
| Every Edition release after that | `/upgrade` (recurring) |
| First time installing Edition into a brand-new repo | `bootstrap-heir.cjs` (one-time) |

If you ever run `migrate-to-edition.cjs` again on a heir that's already on Edition, it refuses — `.github/.act-heir.json` exists, which the pre-flight checks for. You'll see the message *"this heir is already on Edition — use upgrade-self.cjs instead"* and exit cleanly.

## Why Two Phases

| Mechanical | Semantic |
|------------|----------|
| Repeatable | Judgment-dependent |
| Same answer every run | Different answer per heir |
| Frontmatter-decidable | Content-decidable |
| Safe to ship as a script | Safe to ship as a prompt |

Mixing them produces tools that are either too aggressive (auto-port everything → wipes useful judgment) or too timid (port nothing → defeats the purpose). Splitting them lets each tier do what it's good at.

## What's Lost (Intentionally)

Edition removed several primitives that older Alex heirs had. The migration drops them on purpose:

| Lost | Why | Mitigation |
|------|-----|------------|
| `agents/*.agent.md` | Edition has no agent primitive | Port the system prompt into `prompts/local/<name>.prompt.md` |
| `hooks/*.cjs` | Edition has no hook event registry | Pre-commit hooks survive at `.git/hooks/` if installed |
| `episodic/*.md` | Master-only operational state | Not relevant to heirs |
| Extension-UI configs | Tied to a deprecated brain-extension | Archive only; Edition is brain-only |
| Old `inheritance:` frontmatter | Edition uses path-based ownership (`local/` subdirs) | Stripped during port |

If a heir genuinely depended on agent or hook content, that content is preserved in the snapshot and you can resurrect the *content* (not the primitive) into a prompt or local instruction.

## Manual Alternative

If you'd rather not use the script, the manual recipe is:

```powershell
cd <heir-repo>
Rename-Item .github .github-old
git clone --depth 1 https://github.com/fabioc-aloha/Alex_ACT_Edition.git $env:TEMP\edition
node $env:TEMP\edition\.github\scripts\bootstrap-heir.cjs --target . --apply
node .github\muscles\heir-doctor.cjs
# Then mine .github-old/ by hand: copy custom skills/instructions/prompts/muscles into local/
git add -A
git commit -m "Migrate to Alex ACT Edition"
```

The script just automates and instruments this. For a single migration with mostly custom content, manual is fine. For multiple migrations or a heir with substantial inherited master content, the script's triage saves real time.

## Snapshot Cleanup

After running the migration and the semantic pass, the snapshot stays at `.github-old-YYYY-MM-DD/` in your repo. **Don't delete it immediately.** Keep it for 1–2 weeks while you confirm nothing was missed. Then drop it in a separate commit:

```powershell
Remove-Item .github-old-* -Recurse
git add -A
git commit -m "Drop migration snapshot — migration verified"
```

If during that window you discover something missing from the new brain, the snapshot is still there and trivially recoverable.
