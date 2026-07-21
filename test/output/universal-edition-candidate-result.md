# Universal Edition Candidate Result

**Date:** 2026-07-21  
**Candidate source:** Edition `be0aca33a057af2bd8f39f17b0bfc8c21789fa2f`  
**Candidate branch:** `experiment/universal-edition-candidate`  
**Copilot CLI:** 1.0.72

## Deterministic Results

| Check | Result |
| --- | --- |
| Full parallel Edition and candidate suite | 112/112 pass |
| Candidate compatibility suite | 9/9 pass |
| Adoption transaction suite | 5/5 pass |
| Manifest suite | 16/16 pass |
| Baseline artifact register | 162/162 mapped: 121 Keep, 31 Adapt, 10 Optional, 0 Retire |
| POC evidence suite | 12/12 pass |
| Core instruction review | 4/4 pass, 33-34 lines each |
| Core skill review | 7/7 pass, 21-28 lines each |
| Candidate manifest check | Pass |
| Surface-profile checker | Pass: `copilot-app`, `vscode` |
| Core-template checker | Pass: six templates |

## Profile Pilots

| Pilot | Result |
| --- | --- |
| Blank `copilot-app` repository | 178 operations, zero conflicts, Core present, no `.vscode`, backup present, clean rollback |
| Existing `copilot-app` repository | 178 operations, zero conflicts, project workflow preserved, profile marker correct, clean rollback |
| Blank `vscode` repository | 187 operations, zero conflicts, CSS and configure prompts present, profile marker correct, clean rollback |

## Runtime Evidence

| Gate | Result |
| --- | --- |
| TC-003 update/adoption behavior | Pass: plan hash, apply, marker, project preservation, profile isolation, visible diff, clean rollback |
| TC-004 fresh-session repeatability | Pass: North Star, path instruction, secret suppression, alternatives, disconfirmer, zero changes |
| Candidate Core runtime | Pass: Decision contract and `plan-and-track` skill loaded in a fresh adopted repository; required plan fields present; zero changes |
| Direct custom agents | Pass: `brain-auditor`, `document-assembler`, `illustrator`, and `markdown-author` load through `copilot --agent` |
| TC-005 interactive `/agent` picker | Documented limitation: picker omits repository agents; direct `copilot --agent` remains the supported path |
| TC-006 VS Code cross-host parity | Pass: fresh `vscode` pilot loaded the Core contract, `plan-and-track`, profile prompt, and agent with no file changes |

## Defects Found and Closed

1. Edition's default parallel tests raced on repository-local `local/` fixture
   directories. Mutating manifest tests now run in disposable copies.
2. All four Edition agents used CLI-invalid model arrays. The candidate omits
   the optional model field.
3. `document-assembler` had an unquoted YAML description containing a colon.
   Quoting the field restored direct CLI loading.
4. Current bootstrap can overwrite unmarked existing projects. The candidate
   adds a plan-hash-gated transaction with per-path conflict decisions and
   rollback.

## Promotion Status

**Compatibility matrix complete; not releasable yet.** The Copilot-app profile
is eligible for candidate support with the interactive-picker limitation
documented. Matched retention and Core/Guided benchmark decisions remain open.
No Edition, Extension, Mall, Memory, POC, Marketplace, or user project changed.
