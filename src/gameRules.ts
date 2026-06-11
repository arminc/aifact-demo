export type ContractDefinition = {
  id: string;
  title: string;
  requiredModelQuality: number;
  rewardEuros: number;
};

export type HardwareTier = {
  id: string;
  displayName: string;
  trainingSpeed: number;
};

type RandomSource = () => number;

export const DELIVERY_DURATION_MS = 5000;
export const FIRST_CASH_MILESTONE_EUROS = 100;
export const BASE_TRAINING_MS_PER_CLEAN_DATA = 2000;

export const STARTER_HARDWARE: HardwareTier = {
  id: 'laptop',
  displayName: 'Laptop',
  trainingSpeed: 1
};

export const CONTRACT_LADDER: ContractDefinition[] = [
  { id: 'starter-ai-pilot', title: 'Starter AI Pilot Contract', requiredModelQuality: 8, rewardEuros: 90 },
  { id: 'regional-support-bot', title: 'Regional Support Bot Rollout', requiredModelQuality: 18, rewardEuros: 130 },
  { id: 'retail-forecast-suite', title: 'Retail Forecast Suite', requiredModelQuality: 32, rewardEuros: 200 },
  { id: 'clinic-triage-assistant', title: 'Clinic Triage Assistant', requiredModelQuality: 45, rewardEuros: 160 },
  { id: 'warehouse-routing-optimizer', title: 'Warehouse Routing Optimizer', requiredModelQuality: 60, rewardEuros: 180 },
  { id: 'invoice-anomaly-scanner', title: 'Invoice Anomaly Scanner', requiredModelQuality: 78, rewardEuros: 210 },
  { id: 'local-bank-risk-review', title: 'Local Bank Risk Review', requiredModelQuality: 98, rewardEuros: 240 },
  { id: 'manufacturing-yield-copilot', title: 'Manufacturing Yield Copilot', requiredModelQuality: 120, rewardEuros: 280 }
];

export const getCashMilestoneThreshold = (milestoneIndex: number) =>
  FIRST_CASH_MILESTONE_EUROS * 10 ** milestoneIndex;

export const getNewlyReachedCashMilestones = (euros: number, claimedMilestones: number[]) => {
  const claimed = new Set(claimedMilestones);
  const newlyReachedMilestones: number[] = [];

  for (let index = 0; getCashMilestoneThreshold(index) <= euros; index += 1) {
    const threshold = getCashMilestoneThreshold(index);

    if (!claimed.has(threshold)) {
      newlyReachedMilestones.push(threshold);
    }
  }

  return newlyReachedMilestones;
};

export const getUpcomingCashMilestones = (claimedMilestones: number[], count = 3) => {
  const claimed = new Set(claimedMilestones);
  const upcomingMilestones: number[] = [];

  for (let index = 0; upcomingMilestones.length < count; index += 1) {
    const threshold = getCashMilestoneThreshold(index);

    if (!claimed.has(threshold)) {
      upcomingMilestones.push(threshold);
    }
  }

  return upcomingMilestones;
};

export const getTrainingDurationMs = (cleanDataUsed: number, hardware: HardwareTier) => {
  return Math.max(1000, Math.round((cleanDataUsed * BASE_TRAINING_MS_PER_CLEAN_DATA) / hardware.trainingSpeed));
};

export const resolveCleaningOutcome = (random: RandomSource = Math.random) => {
  return { producedCleanData: random() < 0.75 ? 1 : 0 };
};

export const calculateTrainingQualityGain = (
  cleanDataUsed: number,
  random: RandomSource = Math.random
) => {
  const baseGain = cleanDataUsed * 2;
  const randomBonus = Math.floor(random() * (cleanDataUsed + 2));
  return Math.max(1, baseGain + randomBonus);
};

export const getNextIncompleteContract = (completedContractIds: string[]) => {
  return CONTRACT_LADDER.find((contract) => !completedContractIds.includes(contract.id)) ?? null;
};
