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
