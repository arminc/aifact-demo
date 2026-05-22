# Extend Early Game Mechanics

## Type

feature

## Context

The current browser game has a small first loop for collecting raw data, cleaning data, training a model, finding a contract, and earning euros. The loop is playable, but several mechanics are too fixed for the next iteration: data cleaning always succeeds, training always consumes the same amount of clean data and produces the same quality gain, hardware is only mentioned in text, and only one contract exists. User-facing MVP wording should also be removed now that the game is moving beyond the first slice.

The next iteration should make the early game feel more like operating an AI startup: raw data is not always usable, training choices have uncertain results, hardware affects training speed, and contracts form a non-repeatable progression ladder with increasing model quality requirements.

## Functional Requirements

- Remove user-facing uses of the word "MVP" from the game UI.
- Replace the current deterministic data cleaning behavior with an uncertain cleaning outcome.
- Cleaning should usually produce clean data, but sometimes the raw data should be unusable and produce no clean data.
- Failed cleaning must not cause excessive data loss; for single-dataset cleaning, the expected loss is only the raw data being cleaned.
- Add visible hardware information to the UI.
- Start the player with laptop-level hardware.
- Hardware must immediately affect training time.
- Let the player choose how much clean data to use for a training run.
- Training input must be a whole-number amount of clean data between 1 and the player's currently available clean data.
- The training input UI must provide a clear default selection and prevent starting training with an invalid amount.
- Derive training duration from the selected clean data amount and current hardware capability.
- Make model quality gain random within an early-game range rather than a fixed predictable value.
- Show the player enough information to understand the training tradeoff without exposing an exact guaranteed quality result.
- Replace the single starter contract with a progression ladder of multiple contracts.
- Contracts must have different model quality requirements and rewards.
- Contracts cannot be repeated for now.
- The contract board should offer the next incomplete contract in the ladder; future contracts may be shown as locked context, but they are not selectable unless explicitly implemented in this story.
- Keep contract delivery as the source of euros.

## Technical Requirements

- Build on the existing React + Vite + TypeScript browser game with in-memory state only.
- Keep core game constants and rules separate from presentational JSX where practical.
- Preserve the single active timed activity model for training and contract delivery.
- Introduce a hardware state/config concept with at least a display name and a training-speed metric.
- Use the current laptop as the initial hardware tier.
- Even with only the starter laptop tier, training duration must be calculated through the hardware speed metric rather than by hard-coding a laptop-specific duration.
- Calculate training duration from selected clean data amount and hardware training speed.
- Store the selected training data amount or equivalent training input on the active timed activity so completion can calculate the outcome.
- Replace the fixed model quality gain with a randomized beginner-range calculation based on clean data used and possibly training duration/hardware-derived factors.
- Random cleaning and training calculations must be bounded and testable without flaky automated tests, such as by isolating random helper functions or using an equivalent deterministic test seam.
- Cleaning should succeed more often than it fails, and any valid completed training run should produce a positive model quality gain.
- The player should not see an exact guaranteed quality gain before training completes; use qualitative or estimated messaging instead.
- Keep cleaning randomness bounded so failure does not remove more than the attempted dataset in the initial single-cleaning interaction.
- Model contracts as data-driven definitions with ordering/progression state.
- Offer the next incomplete contract from the ordered contract definitions; showing future locked contracts is allowed but not required.
- Track completed contracts so completed contracts are not offered again.
- Extract pure game-rule helpers and data definitions from presentational JSX where doing so reduces branching in `App.tsx`; React should remain responsible for state wiring and rendering.
- Maintain euros as the only player-facing money unit.
- Update automated tests to cover the changed cleaning, training, hardware, and contract progression behavior.
- Technical decision: failed cleaning produces no clean data rather than destroying all raw data, because losing the full inventory would be too punishing.
- Technical decision: training output is intentionally uncertain, because fixed quality gains make training feel mechanical and unrealistic.
- Technical decision: the player chooses clean data amount, not direct training duration; duration is derived from data amount and hardware to keep the choice understandable.
- Technical decision: hardware affects training immediately through training speed, even before upgrade mechanics exist, so the hardware panel is mechanically meaningful.
- Technical decision: contracts are a non-repeatable progression ladder for now, avoiding contract farming while still giving clear goals.
- Technical decision: the contract ladder offers the next incomplete contract rather than becoming a multi-contract marketplace, keeping the current single revealed/deliverable contract flow simple.
- Technical decision: randomness must have a deterministic test seam because flaky randomness would weaken the automated safety net.
- Rejected alternative: keeping deterministic cleaning was rejected because raw data should sometimes be garbage.
- Rejected alternative: showing an exact guaranteed training quality gain was rejected because beginner training quality should be uncertain.
- Rejected alternative: repeatable contracts are deferred to avoid adding contract farming/balancing complexity in this iteration.
- Rejected alternative: multiple simultaneously selectable contracts are deferred because contract choice, market balancing, and selection UI are larger than the intended early-game ladder change.

## Acceptance Criteria

- No user-facing game UI text contains the word "MVP".
- The player can attempt to clean raw data and usually receives clean data.
- A cleaning attempt can fail and produce no clean data.
- A failed single-dataset cleaning attempt does not remove more than the raw data being cleaned.
- The UI displays the player's current hardware.
- The starting hardware is a laptop or equivalent starter machine.
- The UI displays a hardware training-speed-related metric or otherwise makes the training-speed effect understandable.
- The player can select how much clean data to use before starting training.
- The selected clean data amount is a valid whole number between 1 and available clean data.
- Training cannot start when the selected clean data amount is invalid.
- Starting training consumes the selected amount of clean data.
- Training duration increases with more selected clean data and is affected by hardware speed.
- Training duration is calculated through the current hardware speed metric, including for the starter laptop tier.
- Training completion increases model quality by a randomized beginner-range amount rather than a fixed constant.
- Any valid completed training run produces a positive model quality gain within the intended beginner range.
- The pre-training UI does not promise an exact guaranteed quality gain.
- The contract board is backed by multiple ordered contracts in a progression ladder and offers the next incomplete contract.
- Future contracts may be shown as locked context, but completed contracts are not selectable or offered again.
- Later contracts require higher model quality and provide different rewards.
- Completed contracts are not repeatable or offered again in the current progression.
- Contract delivery still awards euros only after delivery completes.
- Automated tests cover removal of MVP UI wording, bounded cleaning failure behavior, variable training input/time behavior, visible hardware, hardware-derived training duration, randomized/non-fixed training gain behavior through a non-flaky deterministic seam where practical, and non-repeatable next-contract progression.

## Analysis

### Likely Impact

- Primary implementation lane: `src/App.tsx` in-memory game state/actions -> timed activity completion logic -> contract board/training/hardware JSX -> `src/App.test.tsx` component coverage.
- `src/App.tsx` - current game rules, resource state, contract definitions, single active timed activity, action eligibility, and UI are all embedded here; cleaning is deterministic, training consumes a hard-coded 3 clean data for a fixed `TRAINING_DURATION_MS`, contract reveal always uses `CONTRACTS[0]`, and user-facing MVP text appears in the header/win panel.
- `src/App.test.tsx` - existing coverage drives the current MVP loop with fake timers and fixed expectations for 3 clean data, 6s training, quality gain 8, one starter contract, and MVP wording in describe/test names; it should be updated/expanded for randomized helpers through deterministic seams and the new progression behavior.

### Possible Adjacent Touchpoints

- `src/App.css` - may need focused styling for hardware details, training input controls, estimated/qualitative training messaging, locked/future contract context, or cleaning/training outcome feedback.
- Inference: a small colocated helper/module such as `src/gameRules.ts` may be worth adding if extracting random cleaning/training calculations, hardware tiers, and contract ladder data keeps `App.tsx` from accumulating test-hostile branching.

### Existing Patterns / Prior Art

- `src/App.tsx` - reuse the existing single `activeTimedActivity` model for training and delivery; it already stores `trainingInputCleanData` and computes completion effects when the timer expires.
- `src/App.tsx` - current `CONTRACTS` array is already data-driven enough to extend into an ordered ladder, but delivery currently clears `revealedContractId` without tracking completion, so non-repeatability needs new progression state.
- `src/App.test.tsx` - closest test pattern is the full loop component test using React Testing Library and fake timers; keep user-visible assertions while adding deterministic control over random outcomes.

### Layer Boundaries

- Touch first: `src/App.tsx` gameplay state/rules/UI and `src/App.test.tsx` tests; extract pure rule helpers/data definitions only where it directly improves bounded randomness, hardware duration calculation, or contract ladder tests.
- Avoid unless evidence emerges: persistence/localStorage, backend/API/auth/external services, routing/provider architecture, Vite/package/test setup changes, and hardware upgrade purchasing beyond displaying/using the starter hardware tier.

### Verification Plan

Repo-configured command checks are handled by implementation/validation via `work/project-config.md`.

**Unit Tests**:

- Cover pure cleaning outcome and training quality helpers with deterministic random inputs so success/failure bounds and positive beginner-range gains are non-flaky.
- Cover hardware-derived training duration for the starter laptop and multiple selected clean-data amounts.
- Cover ordered contract progression helper/state so completed contracts are not offered again and later contracts have higher quality/reward differences.

**Integration Tests**:

- Update component flow tests for visible hardware, valid/invalid training input selection, selected clean-data consumption, timer duration changing with selected amount, non-exact pre-training quality messaging, completion quality gain, next incomplete contract reveal, delivery award, and non-repeatable completed contracts.
- Include an assertion that user-facing game UI no longer contains `MVP`.

**E2E / Manual Validation**:

- Manually play a fresh early-game path covering a failed or forced-failure cleaning attempt, a successful cleaning attempt, a variable-size training run, visible hardware speed context, and delivery of at least the first ladder contract.

## Implementation update (2026-05-22 14:42)

- Addressed: removed user-facing MVP text; added bounded random cleaning helper; added hardware state display + speed-based training duration; added variable training input with validation and non-exact pre-training messaging; replaced single contract with ordered non-repeatable ladder progression; added deterministic helper + component tests for updated behavior.
- Not addressed: manual playthrough from verification plan (not executed in this automated pass).
- Status: done

## Validation update (2026-05-22 14:42)

* Validation passed with no regressions found.
* Gate result: PASS.
* Baseline checks passed or had no unrelated failures observed.
* Touched-scope coverage: no material regression.
* Security review: completed (no auth/permissions/secrets/external-call risk introduced in touched scope).
* Retained exploratory artifacts: none.
* Validated checklist items: MVP text removal; bounded uncertain cleaning behavior; visible starter hardware + speed metric; whole-number bounded training input with invalid-state prevention; training duration derived from selected clean data and hardware speed; randomized positive training quality gain with deterministic test seam; non-repeatable next-incomplete contract ladder with varied requirements/rewards; delivery awarding euros after timed completion; automated coverage for updated mechanics.
* Providers covered: not applicable (single local in-memory game implementation).
