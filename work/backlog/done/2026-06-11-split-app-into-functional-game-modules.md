# Split App into functional game modules

## Type

chore

## Context

The browser game is growing beyond the initial prototype shape. `src/App.tsx` currently owns state initialization, timed activity lifecycle handling, derived gameplay state, player action handlers, and all main page rendering. Some pure gameplay rules already live in `src/gameRules.ts`, but most app flow and UI composition remain concentrated in one file.

As more mechanics are added, keeping everything in `App.tsx` will make the game harder to follow, review, and test. This story captures a behavior-preserving refactor to split the current app into functional game-domain and UI files before the code grows further.

## Functional Requirements

- Preserve the current visible gameplay behavior.
- Preserve the current early-game loop: collect data, clean data, train model, find contracts, deliver contracts, earn cash, and display Rich Uncle milestones.
- Keep all existing user-facing labels, controls, timing behavior, and milestone behavior unchanged unless a test only needs selector updates caused by file movement.
- Do not add new mechanics, balance changes, persistence, routing, global state libraries, prestige reset behavior, or Rich Uncle Point spending.

## Technical Requirements

- Split `src/App.tsx` into smaller files organized by functional responsibility.
- Keep `App.tsx` as the composition/root container instead of the home for all state, handlers, and markup.
- Extract shared game/domain types such as startup state and timed activity types into a dedicated game-domain file.
- Extract initial game state into a dedicated file.
- Extract reusable derived game state/selectors where it improves readability, such as startup phase, activity progress, action availability, milestone display data, or current activity text.
- Extract UI sections into focused React components, with likely candidates including startup state, timed activity, contract board, operations, and milestone panels.
- Keep pure rules and constants in `gameRules.ts` or move them into an equivalent game-domain rules location without changing their behavior.
- Preserve the existing React, TypeScript, Vite, Vitest, React Testing Library, and jsdom stack.
- Prefer a conservative split over a large architecture overhaul.
- Use domain-oriented grouping rather than adding a generic framework or external state-management library.
- Rejected alternative: leave all behavior in `App.tsx` until more mechanics exist; this would increase coupling and make later refactors riskier.
- Rejected alternative: introduce Redux, Zustand, routing, or another architectural layer as part of this refactor; the current scope only needs clearer file boundaries.

## Acceptance Criteria

- `src/App.tsx` is materially smaller and primarily composes game state/actions with extracted UI sections.
- Game-domain state/types/initial state are available from dedicated module files rather than being embedded only in `App.tsx`.
- Major UI panels are extracted into focused components with clear props.
- Existing pure game rule tests continue to cover rule behavior.
- Existing app/gameplay tests continue to pass after any necessary import or helper updates.
- No intentional gameplay, balance, timing, milestone, or text changes are introduced.
- No new runtime dependencies are added.

## Analysis

### Likely Impact

- Primary implementation lane: `src/App.tsx` root container -> extracted game-domain state/types/selectors/actions -> extracted presentational section components.
- `src/App.tsx` - currently owns `StartupState`, `ActiveTimedActivity`, initial state, timer effects, derived selectors, action handlers, and all panel markup, so this is the main behavior-preserving refactor target.
- `src/gameRules.ts` - already contains pure gameplay constants/rules for contracts, milestones, cleaning, training, and durations; keep these stable unless type exports or tiny selector moves are needed.

### Possible Adjacent Touchpoints

- New `src` game-domain modules - likely for shared types, initial state, derived state/selectors, and possibly action helpers around timed activity completion.
- New `src` UI component modules - likely for Startup State, Timed Activity, Contract Board, Operations, and Milestone panels with explicit props.
- `src/App.test.tsx` - may need helper/import updates if section structure remains accessible but implementation files move; preserve existing user-visible assertions and timer-driven gameplay coverage.
- `src/gameRules.test.ts` - should stay mostly unchanged unless pure rule exports move to an equivalent rules module.

### Existing Patterns / Prior Art

- `src/gameRules.ts` and `src/gameRules.test.ts` - closest domain-pattern precedent: pure functions/constants are exported from one module and tested without React.
- `src/App.test.tsx` - closest behavior-preservation guide: tests interact through headings, buttons, labels, fake timers, and displayed resources rather than implementation details.
- `src/App.tsx` - markup is already grouped by section headings, making the safest component boundaries the existing panels: Startup State, Timed Activity, Contract Board, Operations, and Milestone reached.

### Layer Boundaries

- Touch first: `src/App.tsx`, new colocated domain modules under `src`, and focused React component modules under `src`.
- Avoid unless evidence emerges: build/tooling config, routing, persistence, backend/API layers, global state libraries, dependency changes, and balance/rule changes in `gameRules.ts`.
- Keep `src/main.tsx` untouched unless the root export shape of `App` changes, which this story does not require.

### Verification Plan

**Unit Tests**:

- Add or adjust tests only for newly extracted pure selectors/helpers where behavior is no longer directly covered by existing rule tests.

**Integration Tests**:

- Preserve the existing gameplay-loop coverage for data collection, cleaning, timed training, contract reveal/delivery, and Rich Uncle milestones after module extraction.

**E2E / Manual Validation**:

- Manually smoke-check the early-game loop in the browser if component extraction changes panel composition or prop wiring.

## Implementation notes (2026-06-11 09:46)

- Extracted startup state/types and timed-activity completion into `src/gameState.ts`.
- Extracted derived view state/selectors into `src/gameSelectors.ts`.
- Split major UI panels into focused components under `src/components/` and kept `src/App.tsx` as the root composer with state/effects/action wiring.
- Verification: `npm test` and `npm run build` pass; browser smoke checked collect → clean → train panel wiring locally.
- Status: done.

## Validation update (2026-06-11 09:50)

* Validation passed with no regressions found.
* Gate result: PASS.
* Baseline checks passed or had no unrelated failures observed: `npm test` passed 14 tests across 2 files; `npm run build` passed.
* Touched-scope coverage: no material regression; existing app/gameplay and pure rule tests still cover the refactored behavior.
* Security review: completed; front-end-only refactor, no auth, persistence, external calls, secrets, file access, or privileged workflows introduced.
* Retained exploratory artifacts: none; UI/browser delegation was not required because automated React gameplay tests cover the user-visible behavior and implementation notes already record a local smoke check.
* Validated checklist items: App root materially smaller and composition-focused; game state/types/initial state extracted; selectors/view state extracted; major UI panels extracted with explicit props; pure game rules/tests preserved; app gameplay tests pass; no intentional gameplay, balance, timing, milestone, text, dependency, or stack changes found.
* Providers covered: not applicable.
