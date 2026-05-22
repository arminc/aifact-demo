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

## Analysis

### Likely Impact

- Primary implementation lane: test tooling setup -> `src/App.tsx` component tests -> npm test script/package lock updates.
- `package.json` - currently has only `dev`, `build`, and `preview` scripts and no Vitest/React Testing Library/jsdom dev dependencies, so test runner dependencies and a `test` script are in scope.
- `vite.config.ts` - currently only wires the React plugin; likely place to add Vitest DOM environment configuration if not using a separate Vitest config.
- `src/App.test.tsx` or equivalent colocated test file - the game loop is implemented entirely in `src/App.tsx`, with button-driven state transitions and visible resource/activity output suitable for React Testing Library assertions.
- `package-lock.json` - expected to change when adding test dependencies.

### Possible Adjacent Touchpoints

- `src/test/setup.ts` or similar - may be needed for `@testing-library/jest-dom` matchers and DOM cleanup setup.
- `tsconfig.app.json` / TypeScript config - may need Vitest or jest-dom types if the chosen setup requires global test APIs or matcher typing.
- `src/App.tsx` - should only be touched for tiny testability fixes if fake timers expose timing flakiness; the current UI already exposes state, controls, activity labels, and progress through user-visible text/roles.

### Existing Patterns / Prior Art

- `src/App.tsx` - closest implementation pattern and test target: initial state lives in `initialState`, actions are React button handlers, timed training/delivery use `Date.now()` plus `window.setInterval`, and completion updates visible cash/model/activity state.
- `src/main.tsx` - confirms the app has a single `App` entry point and no router/provider setup to reproduce in component tests.
- No existing test files or test setup were found; follow standard Vite + React + Vitest + React Testing Library patterns rather than repo-local prior art.

### Layer Boundaries

- Touch first: npm/Vitest test setup, component-level tests around `App`, and minimal DOM test setup.
- Avoid unless evidence emerges: backend/API/persistence/auth/external service layers, E2E/browser automation, major game-state refactors, routing/provider architecture, and CSS-only files.

### Verification Plan

Repo-configured command checks are handled by implementation/validation via `work/project-config.md`.

**Unit Tests**:

- Cover `App` behavior through user-visible text, roles, and button interactions for initial resources/phase, data collection/cleaning, training eligibility, busy-state disabling, fake-timer training completion, contract reveal/delivery eligibility, fake-timer delivery completion, and €100 milestone.
- Include timer handling that advances fake timers within React Testing Library `act`/user-event-compatible flows so training and delivery tests do not wait for real 5-6 second durations.

**Integration Tests**:

- Exercise the full MVP loop in one component-level flow from initial state through milestone completion to catch sequencing regressions across actions and timed activities.

**Additional Checks (as applicable)**:

- Confirm the added test setup does not require browser E2E tooling or non-DOM external services.

## Implementation notes (2026-05-22 00:00)

- Added Vitest + React Testing Library + jsdom + jest-dom setup for component tests.
- Added `npm test` script (`vitest run`) in `package.json`.
- Configured Vitest in `vite.config.ts` with `jsdom` environment and setup file `src/test/setup.ts`.
- Added `src/App.test.tsx` coverage for initial state and full MVP loop using fake timers:
  - data collection/cleaning eligibility and transitions
  - training eligibility, start, busy-state disabling, timed completion, model quality gain
  - contract reveal and delivery eligibility
  - timed delivery completion, €100 award, and milestone UI

## Validation update (2026-05-22 14:11)

* Validation passed with no regressions found.
* Gate result: PASS.
* Baseline checks passed or had no unrelated failures observed.
* Touched-scope coverage: no material regression.
* Security review: completed.
* Retained exploratory artifacts: none.
* Validated checklist items: initial startup state at €0/0/0/0 + Foundation setup; collect data increments raw when idle; clean data disabled before raw exists; clean data converts -1 raw/+1 clean; train model disabled before 3 clean; training start consumes 3 clean and shows timed activity; actions disabled during timed training; training completion increases model quality; find contract reveals starter contract details; deliver contract disabled until quality threshold met; delivery start shows timed activity and blocks other actions; delivery completion awards €100 and milestone state; Vitest + RTL + jsdom setup present; npm test script executes suite; build remains successful; fake timers used for timed tests; no E2E/backend/persistence/auth/external dependencies introduced.
* Providers covered: not applicable (single local frontend test surface).
