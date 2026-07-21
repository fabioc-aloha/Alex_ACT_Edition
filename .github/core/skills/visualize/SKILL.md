---
name: visualize
description: "Creates and validates Mermaid and portable SVG diagrams. Use when architecture, process, sequence, state, or ownership is clearer visually than in prose."
lastReviewed: 2026-07-21
---

# Visualize

1. Choose Mermaid for maintainable topology and SVG for precise portable art.
2. Keep labels accessible and independent of host-specific rendering controls.
3. Validate Mermaid syntax or SVG XML and dimensions.
4. Preserve a text explanation for users whose host cannot render the visual.

## Output

Return the visual artifact plus the checker result and a no-render fallback.

## Would Revise If

Revise by 2026-10-21 if either profile cannot inspect the source or exported
artifact without installing a hidden Core dependency.
