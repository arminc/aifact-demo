import { describe, expect, it } from 'vitest';
import {
  calculateTrainingQualityGain,
  CONTRACT_LADDER,
  getNewlyReachedCashMilestones,
  getNextIncompleteContract,
  getTrainingDurationMs,
  getUpcomingCashMilestones,
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

  it('awards one cash milestone point for each newly crossed power of ten threshold', () => {
    expect(getNewlyReachedCashMilestones(99, [])).toEqual([]);
    expect(getNewlyReachedCashMilestones(100, [])).toEqual([100]);
    expect(getNewlyReachedCashMilestones(10_000, [100])).toEqual([1000, 10000]);
  });

  it('does not award already claimed cash milestones again', () => {
    expect(getNewlyReachedCashMilestones(1000, [100, 1000])).toEqual([]);
    expect(getUpcomingCashMilestones([100], 3)).toEqual([1000, 10000, 100000]);
  });

  it('extends ordered contract rewards beyond the second cash milestone', () => {
    const totalContractRewards = CONTRACT_LADDER.reduce((total, contract) => total + contract.rewardEuros, 0);

    expect(CONTRACT_LADDER).toHaveLength(8);
    expect(totalContractRewards).toBeGreaterThanOrEqual(1000);
    expect(CONTRACT_LADDER[0].rewardEuros).toBeLessThan(100);
    expect(CONTRACT_LADDER.every((contract, index) => index === 0 || contract.requiredModelQuality > CONTRACT_LADDER[index - 1].requiredModelQuality)).toBe(true);
  });
});
