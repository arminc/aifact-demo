# Establish Browser Game Foundation

## Type

chore

## Context

The project needs a non-throwaway technical foundation for a browser-based incremental game about building an AI startup from a laptop. The first delivery slice should establish the application stack and structure without attempting to implement the full game loop yet.

The chosen direction is a static browser app using React, Vite, and TypeScript. The game is in-memory only for now, with no backend and no persistence requirement in this story.

## Functional Requirements

- Create a browser application shell that can be run locally in development.
- Render a minimal page for the AI startup incremental game.
- Show placeholder game state such as money, data, model quality, or current activity.
- Include placeholder controls that demonstrate how future clicker actions will be represented.
- Make clear in the UI that this is an early AI startup builder foundation, not a parody prototype.

## Technical Requirements

- Use Vite, React, and TypeScript as the foundation stack.
- Keep the app deployable as static browser assets.
- Do not add a backend, database, authentication, or API integration.
- Keep game state in memory only.
- Establish a simple structure that can later support resources, actions, timed activities, contracts, and win conditions.
- Include standard local development and build scripts for the chosen Vite setup.
- Prefer simple, explicit state management in React for the foundation; do not introduce an external state management library yet.
- Technical decision: React + Vite + TypeScript is chosen because it gives a small static app foundation while supporting future UI and state growth.
- Rejected alternative: plain JavaScript or untyped HTML was rejected because the project should become a durable foundation rather than a throwaway prototype.
- Rejected alternative: backend-backed architecture was rejected because the current scope is an in-memory browser MVP.

## Acceptance Criteria

- A developer can install dependencies and run the app locally.
- A developer can build the static browser app successfully.
- The app renders a minimal AI startup game shell in the browser.
- Placeholder state and controls are visible and organized in a way that can be extended by the MVP story.
- No persistence, backend, or external API dependency is required.

## Analysis

### Likely Impact

- Primary implementation lane: repository root app scaffold -> Vite React TypeScript entrypoint -> in-memory React game shell/state -> static build/development scripts.
- `package.json`, Vite config, TypeScript config, `index.html`, and `src/` app files are likely in scope because the repo currently has no root application package or `src/` tree; only `.opencode/package.json` exists and should not be treated as the app package.
- `src/App.tsx` (or equivalent first app component) should likely hold the minimal shell, placeholder resources, and placeholder controls using simple React state to establish the future MVP extension point.
- `README.md` may need a small update because it currently only contains the project title and does not document install/run/build steps.

### Possible Adjacent Touchpoints

- `src/main.tsx` and `src/index.css`/app CSS - likely needed for browser mounting and minimal presentable static UI.
- `src/game/` or a small typed model module - may be useful if the implementer wants to name resources/actions/timed activity shapes for the upcoming MVP, but should stay lightweight and in-memory.
- `work/backlog/backlog/2026-05-22-build-ai-startup-clicker-mvp.md` - use only as future-facing context for resource/action names; do not implement the full loop in this foundation story.

### Existing Patterns / Prior Art

- No close application prior art was found in the repo; the root currently has only a one-line `README.md` and no `src/` app tree.
- `work/backlog/backlog/2026-05-22-build-ai-startup-clicker-mvp.md` - closest product flow context for the later resources/actions: raw data, clean data, model quality, euros, timed training, contracts, and €100 completion.
- Standard Vite React TypeScript scaffolding is the nearest technical pattern to follow because the story explicitly selects React + Vite + TypeScript and the repo has no existing frontend conventions.

### Layer Boundaries

- Touch first: root frontend scaffold/config, React entrypoint, minimal app component, lightweight styles, npm scripts, and README run/build instructions.
- Avoid unless evidence emerges: backend/server code, databases, persistence/localStorage, authentication, external APIs, deployment infrastructure, external state management libraries, and full MVP mechanics such as timed training, contract delivery, win logic, or hardware upgrades.
- Avoid changing `.opencode/` package/config files; they are tooling for agents rather than the browser game application.

### Verification Plan

Repo-configured command checks are handled by implementation/validation via `work/project-config.md`. The project config currently defines no concrete command rules, so implementation should rely on the scripts introduced by the Vite app.

**E2E / Manual Validation**:

- Run the local dev server and confirm the browser renders an AI startup builder foundation page with placeholder resources and controls.
- Build the static app and confirm the output is generated without requiring a backend, persistence, authentication, or external API configuration.

**Additional Checks (as applicable)**:

- Confirm page refresh does not need to preserve game state; all placeholder state remains in memory only.

## Validation update (2026-05-22 13:36)

* Validation passed with no regressions found.
* Gate result: PASS.
* Baseline checks passed or had no unrelated failures observed.
* Touched-scope coverage: no material regression.
* Security review: completed (no auth, secrets, backend, persistence, or external call risks introduced in touched scope).
* Retained exploratory artifacts: none (UI proof satisfied via code + dev-server readiness + build output for this foundation story).
* Validated checklist items: local dev runnability, static build success, minimal AI startup shell render, placeholder state/controls extensibility, no backend/persistence/API dependency.
* Providers covered: not applicable (single local browser app, no provider variants in scope).
