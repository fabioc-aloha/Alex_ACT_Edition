---
name: plan-and-track
description: "Creates and maintains plans, preflights, trackers, and evidence-based status. Use before non-trivial mutations or when work spans dependencies and checkpoints."
lastReviewed: 2026-07-21
---

# Plan and Track

1. State goal, scope, alternatives, and dependencies.
2. Make the intended diff, checker, stop condition, and rollback inspectable.
3. Recheck current state immediately before mutation.
4. Execute in dependency order and update status from evidence.
5. Stop when the named gate is met or blocked.

Use the templates under `.github/core/templates/` and omit sections that do not
earn their cost for the task.

## Output

Produce a plan or tracker whose status derives from checks, not percentages.

## Would Revise If

Revise by 2026-10-21 if three routine tasks create unused planning artifacts or
one consequential task proceeds without its required checker or rollback.
