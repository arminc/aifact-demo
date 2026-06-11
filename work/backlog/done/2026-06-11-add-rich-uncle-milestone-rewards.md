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

## Analysis

### Likely Impact

- Primary implementation lane: `src/gameRules.ts` milestone/contract rules -> `src/App.tsx` in-memory state and delivery completion path -> `src/App.test.tsx`/`src/gameRules.test.ts` coverage.
- `src/gameRules.ts` - currently holds `WIN_EUROS = 100`, `CONTRACT_LADDER`, and `getNextIncompleteContract`; this is the narrowest place to replace the one-off threshold with scalable milestone helpers and extend the ordered contract ladder.
- `src/App.tsx` - delivery completion adds `rewardEuros` directly to `euros` at lines 96-102 and the UI still derives `hasWon` from `WIN_EUROS`; this is the likely place to calculate newly crossed milestones, track claimed milestone thresholds in `StartupState`, display Rich Uncle Points, and fold old €100 win messaging into milestone messaging.
- `src/App.css` - likely only small styling additions for a compact reveal/details/tooltip pattern; existing panel/resource-grid/hint styles can be reused.

### Possible Adjacent Touchpoints

- `src/gameRules.test.ts` - add rule-level checks for power-of-ten milestone generation, multi-threshold crossing, and contract ladder reachability beyond €1,000.
- `src/App.test.tsx` - add component-flow checks for RUP display, first/second milestone award after timed contract delivery, no repeat award, upcoming milestone reveal, and no spend/reset controls.
- `work/adr/2026-06-11-introduce-rich-uncle-points-as-prestige-currency.md` - confirms the story direction; no implementation change expected.

### Existing Patterns / Prior Art

- `src/gameRules.ts` `CONTRACT_LADDER` + `getNextIncompleteContract` - closest pattern for ordered, reusable rule data/helpers outside the React component.
- `src/App.tsx` timed delivery effect - closest execution path for milestone awarding because all contract cash rewards currently settle there after `DELIVERY_DURATION_MS`.
- `src/App.tsx` Startup State resource grid - closest UI pattern for adding a discoverable RUP total without creating a new primary action area.
- `src/App.test.tsx` contract delivery tests - closest test pattern for driving training/contract delivery with fake timers and asserting displayed resource values.

### Layer Boundaries

- Touch first: game rules/constants/helpers in `src/gameRules.ts`, local `StartupState` and render logic in `src/App.tsx`, focused tests in `src/gameRules.test.ts` and `src/App.test.tsx`.
- Avoid unless evidence emerges: persistence/storage, routing, backend/API layers, restart/prestige reset mechanics, Rich Uncle Point spending/boost mechanics, generated `dist/`, and `.opencode/` tooling.
- Inference: milestone claimed state can be stored as claimed threshold values or exponents; RUP total should be derived from that state or updated only through the same helper to avoid drift.

### Verification Plan

**Unit Tests**:

- Verify milestone helpers award exactly one point per newly crossed power-of-ten threshold starting at €100, including a payout that crosses multiple unclaimed thresholds.
- Verify already claimed thresholds do not award again.
- Verify the extended contract ladder remains ordered and total rewards can exceed €1,000 without making the first €100 milestone unreachable/irrelevant.

**Integration Tests**:

- Drive contract delivery through the UI/timer path and assert cash plus Rich Uncle Point totals update at €100 and €1,000.
- Assert the upcoming milestone reveal shows only the next few milestones and includes future-use/not-spendable copy.
- Assert no restart/reset/prestige or RUP spending controls are present.

**E2E / Manual Validation**:

- Manually confirm the Startup State area remains low clutter, the reveal is discoverable, and existing collect/clean/train/find/deliver actions still work.

## Implementation update (2026-06-11 09:26)

- Addressed: scalable cash milestones, Rich Uncle Point display/reveal, extended contract ladder, and unit/integration coverage.
- Not addressed: manual browser validation was not run.
- Status: done

## Validation update (2026-06-11 09:28)

* Validation passed with no regressions found.
* Gate result: PASS.
* Baseline checks passed or had no unrelated failures observed.
* Touched-scope coverage: no material regression.
* Security review: completed; no security-sensitive auth, token, file, redirect, or external-call paths were introduced.
* Retained exploratory artifacts: `artifacts/e2e/exploratory/local/2026-06-11-0927/01-rich-uncle-milestones/`.
* Validated checklist items: scalable €100+ power-of-ten milestones; exactly one Rich Uncle Point per claimed milestone; multi-threshold payouts; no repeat awards; RUP total display; compact reveal with only next few milestones and not-spendable copy; five added ordered contracts with total rewards above €1,000; no restart/prestige/spend controls; existing collect/clean/train/find/deliver loop intact.
* Providers covered: local Vite/browser app.
