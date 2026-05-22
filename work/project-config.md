# Project Config

This file is the canonical, human-readable source of truth for repo structure, guideline loading, review triggers, and repo-level command rules.

If another repo document conflicts with this file, follow this file.

## Purpose

- Use this file as rule, not background reading.
- Humans read it to understand expected agent behavior.
- Agents read it to decide which guidelines, reviews, and commands apply.

## Repo Structure

- `src/` - browser game application source, including React UI, in-memory game logic, styles, and tests.
- `src/test/` - test setup for component tests.
- `work/backlog/` - durable story state, organized by `backlog/`, `planned/`, `in-progress/`, and `done/`.
- `work/adr/` - Architecture Decision Records.
- `work/guidelines/` - technical guidelines; currently contains no guideline files.
- `work/ideas/` - idea capture.
- `dist/` - generated static build output.
- `.opencode/` - agent/tooling configuration and skills, not browser game application code.
- No `docs/` directory or `Makefile` is currently present.

## Output Rules

- TODO: Define concise response and formatting rules for agents.

## Domain Rules

- Browser game application: `src/**/*`.
- No domain-specific guideline files are currently defined under `work/guidelines/`.

## Technology Rules

- Project type: static browser game for an AI startup incremental/clicker prototype.
- Stack: Vite, React, and TypeScript, as documented in `README.md`, `package.json`, and `work/adr/2026-05-22-tech-stack-for-browser-game.md`.
- Testing: Vitest, React Testing Library, jest-dom, and jsdom, as documented in `package.json`, `vite.config.ts`, and the tech stack ADR.
- Runtime dependencies: React and React DOM.
- No technology-specific guideline files are currently defined under `work/guidelines/`.

## Review Rules

- No review-specific guideline files or trigger rules are currently defined under `work/guidelines/`.

## Loading Rules

### Always Load

- No always-load guideline files are currently defined.

### Analysis

- Use `AGENTS.md`, this file, relevant backlog stories, and relevant ADRs before relying on chat memory.
- Load guideline files only when matching files exist under `work/guidelines/`.

### Implementation

- Load guideline files only when matching files exist under `work/guidelines/`.
- For application changes, inspect relevant files under `src/` and relevant stories/ADRs first.

### Validation

- Load guideline files and review checks only when they are explicitly defined under `work/guidelines/` or relevant backlog story validation plans.

## Command Rules

- Package manager: npm, with `package-lock.json` present.
- Install dependencies: `npm install`.
- Start local development server: `npm run dev`.
- Build static assets: `npm run build` (`tsc -b && vite build`).
- Run automated tests: `npm test` (`vitest run`).
- Preview production build: `npm run preview`.
- No Makefile commands are currently defined.

## Agent Usage Rule

- Read this file first when you need repo structure, guideline loading rules, review triggers, or repo-level command rules.
- Load only the guideline files that match the current task.
- Do not invent rules outside this file, `AGENTS.md`, and the loaded guideline files.
