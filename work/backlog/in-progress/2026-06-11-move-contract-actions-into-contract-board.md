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
