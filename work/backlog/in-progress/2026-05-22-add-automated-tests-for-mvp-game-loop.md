# Add Automated Tests For MVP Game Loop

## Type

chore

## Context

The project currently has a Vite + React + TypeScript browser game MVP with the core AI startup loop implemented in `src/App.tsx`, but no automated test infrastructure or test cases. The available npm scripts cover development, production build, and preview only.

The MVP includes user-visible behavior for collecting raw data, cleaning data, training a model through a timed activity, revealing a starter contract, delivering the contract through a timed activity, and reaching the first €100 milestone. Automated tests should provide a basic safety net for this loop before future mechanics are added.

## Functional Requirements

- Add automated tests for the current MVP gameplay behavior.
- Verify the initial startup state starts at €0, 0 raw data, 0 clean data, 0 model quality, and the Foundation setup phase.
- Verify raw data collection increments raw data when the app is idle.
- Verify cleaning data is disabled until raw data exists.
- Verify cleaning data converts 1 raw data into 1 clean data.
- Verify model training is disabled until at least 3 clean data exists.
- Verify starting model training consumes 3 clean data and starts a visible timed activity.
- Verify actions are disabled while a timed training activity is active.
- Verify completing training increases model quality.
- Verify finding a contract reveals the starter contract details.
- Verify contract delivery is disabled until the revealed contract quality threshold is met.
- Verify starting contract delivery shows a visible timed delivery activity and blocks other actions.
- Verify completing contract delivery awards €100 and shows the milestone completion state.

## Technical Requirements

- Use Vitest as the test runner because the app is already built on Vite and TypeScript.
- Use React Testing Library for component-level behavior tests that interact with the UI the way a user would.
- Add an npm `test` script that runs the automated test suite.
- Add any required DOM test environment setup, such as jsdom, needed for React component tests.
- Use fake timers for training and delivery tests so the suite does not wait for real 5-6 second timers.
- Prefer user-visible assertions over testing React implementation details.
- Keep the first test slice focused on the existing MVP loop; do not introduce end-to-end browser automation in this story.
- Do not add backend, persistence, API, authentication, or external service dependencies.
- Do not refactor game architecture unless a very small extraction is required to make tests reliable.
- Technical decision: component tests are the best first safety net because the current app is small and the key risks are user-visible UI state transitions.
- Technical decision: fake timers are required because the MVP deliberately includes timed training and delivery activities.
- Rejected alternative: browser-level end-to-end tests are deferred because the first testing goal is a fast, local safety net for the existing React behavior.
- Rejected alternative: pure unit tests for extracted game logic are deferred because the current logic is embedded in `src/App.tsx` and the most valuable first coverage is the visible MVP flow.

## Acceptance Criteria

- The project has a working automated test setup compatible with Vite, React, and TypeScript.
- `npm test` runs the automated tests successfully.
- Tests cover the initial state, collect data, clean data, training eligibility, timed training completion, contract reveal, delivery eligibility, timed delivery completion, and €100 milestone state.
- Timed activity tests complete quickly without waiting for real training or delivery durations.
- The existing production build still succeeds after adding the test setup.
- No end-to-end browser test framework, backend, persistence layer, authentication, or external API dependency is introduced.
