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
export const WIN_EUROS = 100;
export const BASE_TRAINING_MS_PER_CLEAN_DATA = 2000;

export const STARTER_HARDWARE: HardwareTier = {
  id: 'laptop',
  displayName: 'Laptop',
  trainingSpeed: 1
};

export const CONTRACT_LADDER: ContractDefinition[] = [
  { id: 'starter-ai-pilot', title: 'Starter AI Pilot Contract', requiredModelQuality: 8, rewardEuros: 90 },
  { id: 'regional-support-bot', title: 'Regional Support Bot Rollout', requiredModelQuality: 18, rewardEuros: 130 },
  { id: 'retail-forecast-suite', title: 'Retail Forecast Suite', requiredModelQuality: 32, rewardEuros: 200 }
];

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
