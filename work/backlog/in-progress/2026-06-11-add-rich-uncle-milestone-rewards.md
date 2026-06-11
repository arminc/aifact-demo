# Add Rich Uncle Milestone Rewards

## Type

feature

## Context

The game currently has a one-off first cash milestone at €100. Introduce a scalable milestone system that awards Rich Uncle Points as future prestige-style currency. Rich Uncle Points cannot be spent yet, but they should be visible enough for players to understand they were earned and will matter after a future restart/prestige feature.

The current contract ladder does not let players reach €1,000. Expand early contract content so the second milestone is reachable without adding the restart/prestige mechanics yet.

## Functional Requirements

- Add cash milestones at €100, €1,000, €10,000, €100,000, continuing by powers of ten.
- Award exactly 1 Rich Uncle Point for each milestone reached.
- Rich Uncle Points are earned once per milestone and cannot currently be spent.
- If a single cash reward crosses multiple unclaimed milestone thresholds, award all crossed milestone points.
- Show the player's total Rich Uncle Points in the game state or similarly discoverable status area.
- Avoid cluttering the main UI with the full milestone ladder.
- Make upcoming milestones available through a hover, click, details disclosure, tooltip, popover, or similar lightweight reveal pattern.
- Show only the next few upcoming milestones in that reveal, not the entire infinite ladder.
- Add 5 additional lower-paying contracts so reaching €1,000 is possible in the current game.
- Preserve the existing contract flow: contracts unlock in order, can be delivered once, and require sufficient model quality.
- Do not add restart/prestige reset behavior in this story.
- Do not add Rich Uncle Point spending or startup boost behavior in this story.

## Technical Requirements

- Implement milestones as a scalable cash-threshold model based on powers of ten starting at €100, rather than as a single hardcoded win condition.
- Track claimed/reached milestones separately from current cash so each milestone awards only once.
- Calculate newly reached milestones after cash changes, especially after contract delivery rewards.
- Keep Rich Uncle Points derived from claimed milestones or stored consistently with claimed milestone state so the total cannot drift.
- Update the existing €100 milestone/win messaging to fit the new milestone system instead of creating a conflicting separate milestone concept.
- Add five new contract definitions to the existing contract ladder with lower payouts relative to later-game milestones, while making total available contract rewards exceed €1,000.
- Choose contract reward and required model quality values that continue the early-game progression without making the first €100 milestone obsolete.
- Use a low-clutter UI affordance for upcoming milestones, such as a compact button/details element or hover/click reveal.
- Ensure the reveal communicates that Rich Uncle Points are future-use prestige-style currency and currently have no action.
- Maintain the current in-memory game model; persistence is out of scope for this story.
- Rejected alternative: adding restart/prestige behavior now, because the agreed scope is only to earn/display points for future use.
- Rejected alternative: showing the full milestone ladder directly on the main screen, because the user requested avoiding UI clutter.
- Rejected alternative: variable Rich Uncle Point rewards for larger milestones, because the decision is exactly 1 point per milestone.

## Acceptance Criteria

- When the player reaches €100 for the first time, they receive 1 Rich Uncle Point.
- When the player reaches €1,000 for the first time, they receive 1 additional Rich Uncle Point.
- Milestones continue conceptually as €10,000, €100,000, and further powers of ten.
- A milestone does not award another Rich Uncle Point if the player was already credited for that threshold.
- A payout that crosses more than one unclaimed milestone grants one point for each crossed milestone.
- The UI displays the player's total Rich Uncle Points.
- The UI does not show the full milestone ladder by default.
- The player can hover, click, or otherwise reveal the next few upcoming milestones.
- The reveal includes only the next few milestones and explains that Rich Uncle Points are not spendable yet.
- Five additional lower-paying contracts are available in sequence.
- Completing available contracts can bring the player's cash total to at least €1,000.
- No restart/reset/prestige boost action is available yet.
- No Rich Uncle Point spending action is available yet.
- Existing core actions for collecting data, cleaning data, training, finding contracts, and delivering contracts remain intact.
