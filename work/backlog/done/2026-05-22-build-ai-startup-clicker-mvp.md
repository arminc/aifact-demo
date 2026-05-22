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

## Analysis

### Likely Impact

- Primary implementation lane: `src/App.tsx` React state/actions -> timed activity handling -> presentational UI in the same app shell.
- `src/App.tsx` - current app already owns in-memory startup resources, action handlers, and rendered controls, but uses placeholder starting values and instant actions; this is the first layer to replace with the MVP loop, explicit single active timed activity, contract reveal/delivery state, win state, and data-driven constants/rules.
- `src/App.css` - likely needs focused styling for disabled action states, visible progress/timer feedback, contract details, and completion messaging.

### Possible Adjacent Touchpoints

- `package.json` - only if implementation adds test tooling; current scripts are limited to `dev`, `build`, and `preview`.
- `src/main.tsx` and `src/index.css` - likely no functional changes; only touch for app-level mounting/global layout issues discovered during UI polish.

### Existing Patterns / Prior Art

- `src/App.tsx` - closest prior art is the existing foundation slice: `useState` for all in-memory resources, `useMemo` for derived phase text, and local action handlers wired directly to buttons.
- `src/App.css` - existing panel/resource-grid/actions styling should guide the MVP layout rather than introducing a new UI structure.
- No close prior art for timed activities or contract delivery exists in `src`; those mechanics need to be introduced in the same narrow app lane.

### Layer Boundaries

- Touch first: `src/App.tsx` for game state, rule constants, derived eligibility/progress, action handlers, and JSX; `src/App.css` for minimal visual feedback.
- Avoid unless evidence emerges: persistence (`localStorage`), backend/API layers, routing, hardware upgrade modules, broad project/config changes, and unrelated Vite/React entrypoint changes.

### Verification Plan

Repo-configured command checks are handled by implementation/validation via `work/project-config.md`; command rules are currently not defined there.

**E2E / Manual Validation**:

- Manually play from a fresh load: collect at least 3 raw data, clean into 3 clean data, start timed training, verify other actions are disabled during training, then reveal and deliver the starter contract.
- Verify delivery only awards euros after the visible delivery timer completes, reaches the €100 success state, and does not consume model quality or data.
- Refresh the page and confirm progress resets because persistence is intentionally out of scope.

## Implementation update (2026-05-22 14:05)

- Replaced placeholder startup state with MVP loop state starting at €0 / 0 raw / 0 clean / 0 quality.
- Added explicit single active timed activity model (`training` or `delivery`) with progress bar and countdown UI.
- Implemented collect/clean/train actions with blocking rules; training now requires and consumes 3 clean data.
- Added data-driven contract definitions with one starter contract (`€100`, quality threshold) and reveal/deliver flow.
- Implemented timed contract delivery that awards euros only on completion and does not consume data/model quality.
- Added win-state panel and activity messaging for the €100 completion milestone.
- Updated styles for timed progress, contract card, disabled actions, and completion state.

## Validation update (2026-05-22 14:06)

- `npm run build` passed.

## Implementation feedback (2026-05-22 13:55)

* Gate result: FAIL.
* Build validation passed (`npm run build`), but required UI/browser proof for user-visible acceptance criteria is missing.
* Story verification plan explicitly requires manual/E2E gameplay validation (timed training, action lockouts, contract reveal/delivery timing, €100 win state, and refresh reset), but no retained execution evidence was added.
* Please add validation evidence for the UI flow (at minimum: run log and screenshots/video proving each acceptance-criteria assertion), then re-run story validation.

## Implementation update (2026-05-22 13:57)

- Addressed: Added retained manual/E2E validation evidence artifact set (run log + screenshots) covering timed training, action lockouts, contract reveal/delivery timing, €100 win state, and refresh reset behavior.
- Not addressed: None.
- Status: done

## Validation update (2026-05-22 13:57)

- `npm run build` passed.
- Manual browser validation executed against `http://127.0.0.1:4173` with run log at `work/backlog/in-progress/artifacts/story-dev-server.log`.
- Evidence screenshots:
  - `work/backlog/in-progress/artifacts/01-initial-state.png` (starts at €0, 0 raw, 0 clean, 0 quality)
  - `work/backlog/in-progress/artifacts/02-training-active-lockout.png` (training timer visible; actions blocked during active timed activity)
  - `work/backlog/in-progress/artifacts/03-contract-revealed-quality-met.png` (contract revealed with quality threshold/reward)
  - `work/backlog/in-progress/artifacts/04-delivery-active-lockout.png` (delivery timer visible; train/collect/clean/find/deliver blocked)
  - `work/backlog/in-progress/artifacts/05-win-state-100-euros.png` (€100 reached after delivery completion)
  - `work/backlog/in-progress/artifacts/06-refresh-reset-state.png` (fresh state after reload; persistence intentionally absent)

## Validation update (2026-05-22 13:58)

* Validation passed with no regressions found.
* Gate result: PASS.
* Baseline checks passed or had no unrelated failures observed (`npm run build` passed).
* Touched-scope coverage: no material regression observed for changed MVP loop code (`src/App.tsx`, `src/App.css`).
* Security review: completed (in-memory only flow; no auth/tokens/secrets/external I/O paths introduced; no privileged workflow).
* Retained exploratory artifacts: `work/backlog/in-progress/artifacts/story-dev-server.log`, `work/backlog/in-progress/artifacts/01-initial-state.png`, `work/backlog/in-progress/artifacts/02-training-active-lockout.png`, `work/backlog/in-progress/artifacts/03-contract-revealed-quality-met.png`, `work/backlog/in-progress/artifacts/04-delivery-active-lockout.png`, `work/backlog/in-progress/artifacts/05-win-state-100-euros.png`, `work/backlog/in-progress/artifacts/06-refresh-reset-state.png`.
* Validated checklist items: initial zero state; collect/clean loop; training requires+consumes 3 clean and runs timed; single active timed-activity lockout; contract reveal; quality-gated delivery; timed delivery awards euros only on completion without consuming quality/data; €100 win state; no hardware upgrades present; refresh reset behavior accepted.
* Providers covered: not applicable (single in-memory local app variant).
