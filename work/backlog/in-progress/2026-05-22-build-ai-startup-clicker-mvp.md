# Build AI Startup Clicker MVP

## Type

feature

## Context

The project needs a very small but playable MVP for a browser incremental game about building an AI startup from a laptop. The MVP should validate the core game order and provide a foundation for future mechanics.

The game should feel like a serious startup-builder fantasy, not a parody. The player begins as a solo AI founder using a laptop to collect data, clean data, train a model, find customer contracts, and earn the first €100.

## Functional Requirements

- Implement an in-memory clicker game loop with the following resources:
  - Raw Data
  - Clean Data
  - Model Quality as a numeric score
  - Money in euros
- Start the MVP at €0, 0 raw data, 0 clean data, and 0 model quality.
- Allow the player to click to collect raw data.
- Allow the player to click to clean raw data into clean data.
- Allow the player to start model training when at least 3 clean data is available.
- Starting model training should consume 3 clean data.
- Model training must take time rather than completing instantly.
- While model training is active, the player cannot collect data, clean data, find contracts, or deliver contracts.
- Allow the player to click Find Contract to reveal a customer contract.
- A revealed contract should require a minimum model quality threshold.
- Allow the player to deliver a revealed contract when the model quality threshold is met.
- Contract delivery must take visible time rather than completing instantly.
- Delivering a contract should award money in euros only when delivery completes.
- Delivering a contract should not consume model quality or data in this MVP.
- While delivering a contract, the player cannot train, collect data, clean data, find contracts, or start another delivery.
- While any timed activity is active, no second timed activity can start until the current one completes.
- Include enough contract value to reach the €100 completion state in the MVP; a single starter contract worth €100 is acceptable.
- Show a win or completion state when the player reaches €100.
- Do not include hardware upgrades in this MVP.

## Technical Requirements

- Build on the React + Vite + TypeScript foundation.
- Keep all game state in memory only; do not use localStorage or a backend in this story.
- Represent timed activities explicitly so training and contract delivery can block other actions while active.
- Keep the active timed activity as a single explicit state concept with progress visible in the UI.
- Use a numeric model quality calculation suitable for extension later.
- Initial model quality can be based on clean data and completed training duration; future factors such as data set size, data cleanliness, and hardware speed should be easy to add later.
- Choose a simple default laptop training duration for the MVP and keep it configurable for future hardware upgrades.
- Choose a simple default contract delivery duration for the MVP and keep it configurable for future balancing.
- Keep contract definitions data-driven enough to add more contracts later.
- Keep core game constants and rules, such as contract definitions, timed activity durations, action eligibility, and model quality calculation, separate from presentational JSX where practical while still using simple in-memory React state.
- Use euros consistently for all player-facing money values.
- Technical decision: contracts are the source of money because models should not automatically earn passive income in the MVP.
- Technical decision: contracts require a quality threshold but do not consume model quality or data, keeping the first economy easy to understand.
- Technical decision: training consumes clean data in the MVP so the collect -> clean -> train loop remains meaningful.
- Technical decision: the MVP may use one active revealed contract at a time; contract marketplaces, contract queues, random contract generation, and customer state are out of scope.
- Technical decision: hardware upgrades are deferred until after the €100 MVP loop is proven.
- Rejected alternative: passive model income was rejected because it does not fit the desired early startup-builder loop as well as actively finding and delivering customer contracts.
- Rejected alternative: upgrades in the MVP were rejected to keep the first playable loop focused on earning €100.

## Acceptance Criteria

- The player can progress from zero resources to earning money through the loop: collect data, clean data, train model, find contract, deliver contract.
- Training takes visible time to complete.
- Starting training requires and consumes 3 clean data.
- The UI prevents other actions while training is active.
- The player can click Find Contract to reveal a contract.
- A contract cannot be delivered until its model quality threshold is met.
- Contract delivery takes visible time to complete.
- Delivering a contract awards euros only after delivery completes and does not consume model quality or data.
- The UI prevents training, data collection, data cleaning, finding contracts, and starting another delivery while contract delivery is active.
- No second timed activity can start while another timed activity is active.
- The game shows a clear success state when the player reaches €100.
- The MVP contains no hardware upgrade mechanic.
- Refreshing the page may reset progress because persistence is intentionally out of scope.
