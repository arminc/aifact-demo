import { CONTRACT_LADDER, getNextIncompleteContract, getUpcomingCashMilestones } from './gameRules';
import type { ActiveTimedActivity, StartupState } from './gameState';

export type ActiveProgress = {
  percent: number;
  secondsRemaining: number;
};

export const getStartupPhase = (modelQuality: number) => {
  if (modelQuality >= 40) {
    return 'Early traction';
  }

  if (modelQuality >= 20) {
    return 'Prototype readiness';
  }

  return 'Foundation setup';
};

export const getRevealedContract = (revealedContractId: string | null) => {
  return CONTRACT_LADDER.find((contract) => contract.id === revealedContractId) ?? null;
};

export const getActiveProgress = (
  activeTimedActivity: ActiveTimedActivity | null,
  now: number
): ActiveProgress | null => {
  if (!activeTimedActivity) {
    return null;
  }

  const durationMs = activeTimedActivity.endsAt - activeTimedActivity.startedAt;
  const elapsedMs = Math.min(durationMs, Math.max(0, now - activeTimedActivity.startedAt));
  const percent = Math.floor((elapsedMs / durationMs) * 100);
  const secondsRemaining = Math.max(0, Math.ceil((activeTimedActivity.endsAt - now) / 1000));

  return { percent, secondsRemaining };
};

export const getCurrentActivityText = (
  activeTimedActivity: ActiveTimedActivity | null,
  latestClaimedMilestone: number,
  hasReachedMilestone: boolean
) => {
  if (activeTimedActivity) {
    return activeTimedActivity.label;
  }

  if (hasReachedMilestone) {
    return `Reached €${latestClaimedMilestone.toLocaleString('en-US')} cash milestone — Rich Uncle noticed`;
  }

  return 'Idle — choose your next startup action';
};

export const getGameViewModel = (state: StartupState, selectedTrainingCleanData: number, now: number) => {
  const revealedContract = getRevealedContract(state.revealedContractId);
  const nextContract = getNextIncompleteContract(state.completedContractIds);
  const isBusy = state.activeTimedActivity !== null;
  const richUnclePoints = state.claimedCashMilestones.length;
  const hasReachedMilestone = richUnclePoints > 0;
  const latestClaimedMilestone = Math.max(0, ...state.claimedCashMilestones);
  const hasValidTrainingSelection =
    Number.isInteger(selectedTrainingCleanData) &&
    selectedTrainingCleanData >= 1 &&
    selectedTrainingCleanData <= state.cleanData;

  return {
    startupPhase: getStartupPhase(state.modelQuality),
    revealedContract,
    nextContract,
    isBusy,
    richUnclePoints,
    hasReachedMilestone,
    latestClaimedMilestone,
    upcomingCashMilestones: getUpcomingCashMilestones(state.claimedCashMilestones, 3),
    activeProgress: getActiveProgress(state.activeTimedActivity, now),
    canCollectData: !isBusy,
    canCleanData: !isBusy && state.rawData > 0,
    hasValidTrainingSelection,
    canStartTraining: !isBusy && hasValidTrainingSelection,
    canFindContract: !isBusy && !state.revealedContractId && !!nextContract,
    canDeliverContract:
      !isBusy &&
      !!revealedContract &&
      state.modelQuality >= revealedContract.requiredModelQuality,
    currentActivityText: getCurrentActivityText(
      state.activeTimedActivity,
      latestClaimedMilestone,
      hasReachedMilestone
    )
  };
};
