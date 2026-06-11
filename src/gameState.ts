import {
  calculateTrainingQualityGain,
  CONTRACT_LADDER,
  getNewlyReachedCashMilestones
} from './gameRules';

export type TimedActivityType = 'training' | 'delivery';

export type ActiveTimedActivity = {
  type: TimedActivityType;
  label: string;
  startedAt: number;
  endsAt: number;
  trainingInputCleanData?: number;
  contractId?: string;
};

export type StartupState = {
  euros: number;
  claimedCashMilestones: number[];
  rawData: number;
  cleanData: number;
  modelQuality: number;
  completedContractIds: string[];
  revealedContractId: string | null;
  activeTimedActivity: ActiveTimedActivity | null;
};

export const initialStartupState: StartupState = {
  euros: 0,
  claimedCashMilestones: [],
  rawData: 0,
  cleanData: 0,
  modelQuality: 0,
  completedContractIds: [],
  revealedContractId: null,
  activeTimedActivity: null
};

export const resolveCompletedTimedActivity = (state: StartupState): StartupState => {
  const active = state.activeTimedActivity;

  if (!active) {
    return state;
  }

  if (active.type === 'training') {
    const qualityGain = calculateTrainingQualityGain(active.trainingInputCleanData ?? 1);

    return {
      ...state,
      modelQuality: state.modelQuality + qualityGain,
      activeTimedActivity: null
    };
  }

  const deliveredContract = CONTRACT_LADDER.find((contract) => contract.id === active.contractId);

  if (!deliveredContract) {
    return {
      ...state,
      activeTimedActivity: null
    };
  }

  const nextEuros = state.euros + deliveredContract.rewardEuros;
  const newlyReachedCashMilestones = getNewlyReachedCashMilestones(
    nextEuros,
    state.claimedCashMilestones
  );

  return {
    ...state,
    euros: nextEuros,
    claimedCashMilestones: [...state.claimedCashMilestones, ...newlyReachedCashMilestones],
    completedContractIds: [...state.completedContractIds, deliveredContract.id],
    revealedContractId: null,
    activeTimedActivity: null
  };
};
