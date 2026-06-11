# Introduce Rich Uncle Points as prestige currency

Date: 2026-06-11
Status: Proposed

## Context

The AI startup incremental game needs longer-term progression beyond the current early contract loop. The next story introduces cash milestones at €100, €1,000, €10,000, €100,000, and continuing powers of ten. Each milestone should create anticipation for a future restart/prestige mechanic without requiring that mechanic to exist immediately.

## Decision

Add Rich Uncle Points (RUP) as the game's future-facing prestige currency.

- Award exactly 1 RUP for each reached cash milestone.
- Start milestone thresholds at €100 and continue by powers of ten.
- Treat RUP as earned once per milestone, including when one payout crosses multiple unclaimed milestones.
- Display the player's total RUP, but do not allow spending it yet.
- Explain in the UI that RUP will matter for future restart/start-boost mechanics.
- Keep restart, prestige reset, and RUP spending behavior out of the initial RUP story.

## Consequences

- Players get visible long-term progression before the full prestige loop exists.
- Future restart/start-boost mechanics have a named currency and earning model to build on.
- Milestone reward logic must track claimed thresholds so RUP cannot be awarded repeatedly.
- The UI should avoid clutter by showing only a compact RUP total and revealing the next few milestones on hover, click, or similar interaction.
- Early content must support reaching at least €1,000 so the second RUP can be earned in the current game.
- The current single €100 milestone/win concept should be folded into the broader RUP milestone system to avoid competing milestone definitions.
