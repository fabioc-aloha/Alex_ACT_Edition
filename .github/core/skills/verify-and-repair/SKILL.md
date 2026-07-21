---
name: verify-and-repair
description: "Runs deterministic checks and transfers failure evidence into the next bounded attempt. Use after edits, on failing tests, and before completion claims."
lastReviewed: 2026-07-21
---

# Verify and Repair

1. Run the narrowest checker that can falsify the current hypothesis.
2. Capture the failed assumption, observed output, and affected path.
3. Repair the same slice before widening scope.
4. Rerun the same checker, then the broader regression gate.
5. Report what was actually checked.

## Output

Return check, result, repair evidence, and remaining risk.

## Would Revise If

Revise by 2026-10-21 if repairs repeatedly switch checkers before closing the
original failure or if green checks miss an injected candidate defect.
