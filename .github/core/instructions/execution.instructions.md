---
description: "Executes bounded work through a goal, stop condition, smallest action, deterministic checker, and evidence-carrying repair on every host."
applyTo: "**"
lastReviewed: 2026-07-21
---

# Execution Contract

**Always-on rationale:** Every host can mutate project state, so bounded action
and executable verification must apply independently of the available tool set.

| Step | Required evidence |
| --- | --- |
| Goal | Observable outcome and owner |
| Stop | Condition that ends work or blocks further mutation |
| Action | Smallest reversible change that tests the current hypothesis |
| Check | Executable test or named human review |
| Repair | Failed assumption, observed result, and corrected next action |

After a substantive edit, run the narrowest checker before widening scope.

## Anti-Patterns

| Avoid | Use instead |
| --- | --- |
| Multiple speculative edits before a test | One bounded edit, then check |
| Claiming completion from file existence | Verify behavior and contract |
| Retrying without transferring evidence | Record what failed and why |

## Would Revise If

Revise by 2026-10-21 if the smallest-action loop increases rework or misses
cross-file dependencies in three candidate tasks.
