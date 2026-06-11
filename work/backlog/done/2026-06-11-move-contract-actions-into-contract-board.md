# Move Contract Actions Into Contract Board

## Type

feature

## Context

The current early-game UI separates contract information from contract actions. The Contract Board shows the revealed contract, requirements, reward, and progression hint, while the general Actions panel also contains Find Contract and Deliver Contract. This keeps all clickable actions together, but it weakens the player mental model because contract discovery and delivery belong to the contract workflow rather than the general data/training workflow.

The desired direction is to keep Find Contract as a deliberate player click, move contract-specific actions into the Contract Board, and rename the remaining general Actions panel so it better represents day-to-day startup/model work.

## Functional Requirements

- Move the Find Contract action from the general Actions panel into the Contract Board.
- Move the Deliver Contract action from the general Actions panel into the Contract Board.
- Keep Find Contract as a deliberate click; do not auto-reveal the next contract.
- Keep contract discovery and delivery behavior unchanged apart from where the controls are presented.
- Rename the remaining general Actions panel to Operations.
- Keep Operations focused on non-contract work such as collecting data, cleaning datasets, and training the model.
- In the Contract Board, present contract actions in the relevant contract context:
  - When no contract is revealed and a next contract exists, the board offers Find Contract.
  - When a contract is revealed, the board shows the contract details and offers Deliver Contract.
  - When model quality is too low, Deliver Contract remains disabled.
  - When all current contracts are completed, the board communicates that no contract is available.
- Preserve existing busy-state behavior: timed training or delivery should continue to prevent starting incompatible actions.

## Technical Requirements

- Build on the existing React + Vite + TypeScript in-memory game implementation.
- Primary implementation lane is expected to be `src/App.tsx` for the panel layout and button placement.
- Preserve the existing state model for `revealedContractId`, `completedContractIds`, and `activeTimedActivity`.
- Preserve the existing eligibility rules for finding and delivering contracts; this story is a UI organization change, not an economy or progression change.
- Preserve the current single active timed activity model for training and contract delivery.
- Update user-facing tests that query the previous Actions layout so they continue to verify the contract reveal and delivery flow through the Contract Board.
- Technical decision: Find Contract remains deliberate because contract discovery should stay as an explicit player action and pacing beat.
- Technical decision: the general Actions panel should be renamed Operations because it better fits startup day-to-day work and leaves room for future non-contract mechanics.
- Technical decision: contract actions belong inside Contract Board because the player should evaluate and act on contracts in one contextual area.
- Rejected alternative: keeping all buttons together in one Actions panel was rejected because it prioritizes button grouping over player mental model.
- Rejected alternative: auto-revealing the next contract was rejected because it removes the explicit contract discovery step.
- Rejected alternative: renaming Actions to Data & Training was rejected for now because it is clear but may age poorly as future operations expand beyond data and model training.

## Acceptance Criteria

- The UI contains a panel titled Operations instead of Actions.
- Operations contains collect data, clean dataset, training input, and train model controls.
- Operations does not contain Find Contract or Deliver Contract controls.
- The Contract Board contains the Find Contract control when a next contract can be revealed.
- Clicking Find Contract from the Contract Board reveals the next incomplete contract.
- The Contract Board contains the Deliver Contract control when a contract is revealed.
- Deliver Contract remains disabled until the revealed contract's model quality requirement is met.
- Starting contract delivery from the Contract Board still starts the timed delivery activity.
- Completing contract delivery still awards the contract euros only after the timed activity completes.
- Existing lockout behavior remains intact while training or delivery is active.
- When all current contracts are completed, the Contract Board shows the completed/no-contract-available state and does not offer a repeatable contract.
- Automated tests cover the updated panel labels and the contract flow from the Contract Board.

## Analysis

### Likely Impact

- Primary implementation lane: `src/App.tsx` render layout -> existing `findContract` / `deliverContract` handlers -> existing `activeTimedActivity` completion effect.
- `src/App.tsx` - contract state and behavior already live in one component: `revealedContractId`, `completedContractIds`, `activeTimedActivity`, `canFindContract`, `canDeliverContract`, `findContract`, and `deliverContract` are already defined before render, so this is primarily moving buttons from the current Actions section into the Contract Board and renaming the remaining panel to Operations.
- `src/App.test.tsx` - tests currently locate controls through `getActionsSection()` and click `Find Contract` / `Deliver Contract` there, so helpers/assertions need to reflect Operations vs Contract Board.

### Possible Adjacent Touchpoints

- `src/App.css` - `.actions` is a generic flex button layout currently used by the Actions panel; it can likely be reused in both Operations and Contract Board, but may need a neutral class rename or an added contract-action wrapper if visual grouping changes.

### Existing Patterns / Prior Art

- `src/App.tsx` Contract Board section - already renders revealed contract details, no-contract text, and next-contract hint; add contextual action controls here rather than changing domain logic.
- `src/App.tsx` Actions section - existing button wiring and disabled conditions for `Find Contract` and `Deliver Contract (timed)` should be moved intact to preserve behavior.
- `src/App.test.tsx` gameplay loop test - closest regression path for reveal, delivery timing, reward award, and repeat prevention; adapt it to query Contract Board for contract buttons and Operations for non-contract controls.

### Layer Boundaries

- Touch first: React presentation/layout in `src/App.tsx`, then component tests in `src/App.test.tsx`; minimal style support in `src/App.css` only if needed.
- Avoid unless evidence emerges: `src/gameRules.ts` contract ladder, reward, requirement, duration, and next-incomplete selection logic; timed activity state model and completion semantics in `App.tsx` should remain behaviorally unchanged.

### Verification Plan

**Unit Tests**:

- Update component coverage to assert the panel title is Operations, Operations has only data/clean/training controls, and Contract Board owns `Find Contract` / `Deliver Contract`.
- Cover disabled/enabled delivery from the Contract Board and timed delivery reward after `DELIVERY_DURATION_MS`.

**E2E / Manual Validation**:

- Manually smoke the early loop: collect/clean/train, find contract from Contract Board, verify delivery lockout during active timed work, complete delivery, then reveal the next contract from the board.

## Implementation update (2026-06-11 09:01)

- Addressed: renamed Actions to Operations; moved Find Contract and Deliver Contract into Contract Board context; preserved deliberate reveal, quality-gated delivery, timed delivery, and busy lockout behavior; updated component tests for panel ownership and Contract Board flow.
- Not addressed: manual browser smoke from verification plan was not executed in this automated pass.
- Status: done

## Validation update (2026-06-11 09:01)

- `npm test` passed.
- `npm run build` passed.

## Validation update (2026-06-11 09:02)

* Validation passed with no regressions found.
* Gate result: PASS.
* Baseline checks passed or had no unrelated failures observed: `npm test`, `npm run build`.
* Touched-scope coverage: no material regression; updated component tests cover Operations label/control ownership and Contract Board reveal/delivery flow.
* Security review: completed; UI-only React state/layout change, no auth, token, secret, external-call, file-access, or privileged workflow concerns found.
* Retained exploratory artifacts: none.
* Validated checklist items: Operations replaces Actions; Operations contains collect/clean/training controls only; Contract Board owns Find Contract and Deliver Contract; Find Contract remains deliberate and reveals next incomplete contract; Deliver Contract remains quality-gated; timed delivery still awards euros only after completion; busy-state lockout remains wired through existing `isBusy` guards; all-completed board state does not render a repeatable Find Contract; automated tests cover updated labels and board contract flow.
* Providers covered: not applicable.
