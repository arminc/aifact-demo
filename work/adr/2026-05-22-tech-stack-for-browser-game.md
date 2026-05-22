# Tech stack for browser game

Date: 2026-05-22
Status: Proposed

## Context

We are building a browser-based AI startup incremental game prototype and need a simple, fast setup for UI development, game logic iteration, and local testing.

## Decision

Use:

- Vite for development server and build tooling.
- React for UI rendering and component structure.
- TypeScript for typed game and UI logic.
- Vitest + Testing Library + jsdom for automated tests.

## Consequences

- Fast local iteration with modern frontend tooling.
- Better maintainability from static typing and componentized UI.
- Basic automated test coverage is available for gameplay and UI behavior.
- The project stays fully browser-focused (no backend required for core prototype loop).
