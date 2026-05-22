import { describe, expect, it } from 'vitest';
import {
  calculateTrainingQualityGain,
  CONTRACT_LADDER,
  getNextIncompleteContract,
  getTrainingDurationMs,
  resolveCleaningOutcome,
  STARTER_HARDWARE
} from './gameRules';

describe('game rules', () => {
  it('cleaning outcome is bounded and usually succeeds', () => {
    expect(resolveCleaningOutcome(() => 0.2).producedCleanData).toBe(1);
    expect(resolveCleaningOutcome(() => 0.95).producedCleanData).toBe(0);
  });

  it('training duration scales with selected data and hardware speed', () => {
    const oneDataDuration = getTrainingDurationMs(1, STARTER_HARDWARE);
    const fourDataDuration = getTrainingDurationMs(4, STARTER_HARDWARE);

    expect(fourDataDuration).toBeGreaterThan(oneDataDuration);
  });

  it('training quality gain is randomized but always positive', () => {
    expect(calculateTrainingQualityGain(2, () => 0)).toBeGreaterThan(0);
    expect(calculateTrainingQualityGain(2, () => 0.99)).toBeGreaterThan(
      calculateTrainingQualityGain(2, () => 0)
    );
  });

  it('returns the next incomplete contract from ordered ladder', () => {
    expect(getNextIncompleteContract([])?.id).toBe(CONTRACT_LADDER[0].id);
    expect(getNextIncompleteContract([CONTRACT_LADDER[0].id])?.id).toBe(CONTRACT_LADDER[1].id);
  });
});
