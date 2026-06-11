import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  calculateTrainingQualityGain,
  CONTRACT_LADDER,
  DELIVERY_DURATION_MS,
  getNewlyReachedCashMilestones,
  getNextIncompleteContract,
  getTrainingDurationMs,
  getUpcomingCashMilestones,
  resolveCleaningOutcome,
  STARTER_HARDWARE
} from './gameRules';

type TimedActivityType = 'training' | 'delivery';

type ActiveTimedActivity = {
  type: TimedActivityType;
  label: string;
  startedAt: number;
  endsAt: number;
  trainingInputCleanData?: number;
  contractId?: string;
};

type StartupState = {
  euros: number;
  claimedCashMilestones: number[];
  rawData: number;
  cleanData: number;
  modelQuality: number;
  completedContractIds: string[];
  revealedContractId: string | null;
  activeTimedActivity: ActiveTimedActivity | null;
};

const initialState: StartupState = {
  euros: 0,
  claimedCashMilestones: [],
  rawData: 0,
  cleanData: 0,
  modelQuality: 0,
  completedContractIds: [],
  revealedContractId: null,
  activeTimedActivity: null
};

function App() {
  const [state, setState] = useState<StartupState>(initialState);
  const [now, setNow] = useState(() => Date.now());
  const [selectedTrainingCleanData, setSelectedTrainingCleanData] = useState(1);

  useEffect(() => {
    if (!state.activeTimedActivity) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, [state.activeTimedActivity]);

  useEffect(() => {
    const active = state.activeTimedActivity;

    if (!active || now < active.endsAt) {
      return;
    }

    setState((current) => {
      if (!current.activeTimedActivity || Date.now() < current.activeTimedActivity.endsAt) {
        return current;
      }

      if (current.activeTimedActivity.type === 'training') {
        const qualityGain = calculateTrainingQualityGain(current.activeTimedActivity.trainingInputCleanData ?? 1);

        return {
          ...current,
          modelQuality: current.modelQuality + qualityGain,
          activeTimedActivity: null
        };
      }

      const deliveredContractId = current.activeTimedActivity.contractId;
      const deliveredContract = CONTRACT_LADDER.find((contract) => contract.id === deliveredContractId);

      if (!deliveredContract) {
        return {
          ...current,
          activeTimedActivity: null
        };
      }

      const nextEuros = current.euros + deliveredContract.rewardEuros;
      const newlyReachedCashMilestones = getNewlyReachedCashMilestones(
        nextEuros,
        current.claimedCashMilestones
      );

      return {
        ...current,
        euros: nextEuros,
        claimedCashMilestones: [...current.claimedCashMilestones, ...newlyReachedCashMilestones],
        completedContractIds: [...current.completedContractIds, deliveredContract.id],
        revealedContractId: null,
        activeTimedActivity: null
      };
    });
  }, [now, state.activeTimedActivity]);

  const startupPhase = useMemo(() => {
    if (state.modelQuality >= 40) {
      return 'Early traction';
    }

    if (state.modelQuality >= 20) {
      return 'Prototype readiness';
    }

    return 'Foundation setup';
  }, [state.modelQuality]);

  const revealedContract = useMemo(
    () => CONTRACT_LADDER.find((contract) => contract.id === state.revealedContractId) ?? null,
    [state.revealedContractId]
  );

  const nextContract = useMemo(
    () => getNextIncompleteContract(state.completedContractIds),
    [state.completedContractIds]
  );

  const isBusy = state.activeTimedActivity !== null;
  const richUnclePoints = state.claimedCashMilestones.length;
  const hasReachedMilestone = richUnclePoints > 0;
  const latestClaimedMilestone = Math.max(0, ...state.claimedCashMilestones);
  const upcomingCashMilestones = useMemo(
    () => getUpcomingCashMilestones(state.claimedCashMilestones, 3),
    [state.claimedCashMilestones]
  );

  const activeProgress = useMemo(() => {
    if (!state.activeTimedActivity) {
      return null;
    }

    const durationMs = state.activeTimedActivity.endsAt - state.activeTimedActivity.startedAt;
    const elapsedMs = Math.min(durationMs, Math.max(0, now - state.activeTimedActivity.startedAt));
    const percent = Math.floor((elapsedMs / durationMs) * 100);
    const secondsRemaining = Math.max(0, Math.ceil((state.activeTimedActivity.endsAt - now) / 1000));

    return { percent, secondsRemaining };
  }, [now, state.activeTimedActivity]);

  const canCollectData = !isBusy;
  const canCleanData = !isBusy && state.rawData > 0;
  const hasValidTrainingSelection =
    Number.isInteger(selectedTrainingCleanData) &&
    selectedTrainingCleanData >= 1 &&
    selectedTrainingCleanData <= state.cleanData;
  const canStartTraining = !isBusy && hasValidTrainingSelection;
  const canFindContract = !isBusy && !state.revealedContractId && !!nextContract;
  const canDeliverContract =
    !isBusy &&
    !!revealedContract &&
    state.modelQuality >= revealedContract.requiredModelQuality;

  const currentActivityText = useMemo(() => {
    if (state.activeTimedActivity) {
      return state.activeTimedActivity.label;
    }

    if (hasReachedMilestone) {
      return `Reached €${latestClaimedMilestone.toLocaleString('en-US')} cash milestone — Rich Uncle noticed`;
    }

    return 'Idle — choose your next startup action';
  }, [hasReachedMilestone, latestClaimedMilestone, state.activeTimedActivity]);

  const collectRawData = () => {
    if (!canCollectData) {
      return;
    }

    setState((current) => ({
      ...current,
      rawData: current.rawData + 1
    }));
  };

  const cleanDataset = () => {
    if (!canCleanData) {
      return;
    }

    setState((current) => ({
      ...current,
      rawData: current.rawData - 1,
      cleanData: current.cleanData + resolveCleaningOutcome().producedCleanData
    }));
  };

  const startTrainingCycle = () => {
    if (!canStartTraining) {
      return;
    }

    const startedAt = Date.now();
    const cleanDataUsed = selectedTrainingCleanData;
    const durationMs = getTrainingDurationMs(cleanDataUsed, STARTER_HARDWARE);

    setState((current) => ({
      ...current,
      cleanData: current.cleanData - cleanDataUsed,
      activeTimedActivity: {
        type: 'training',
        label: `Training model on ${STARTER_HARDWARE.displayName}`,
        startedAt,
        endsAt: startedAt + durationMs,
        trainingInputCleanData: cleanDataUsed
      }
    }));
  };

  const findContract = () => {
    if (!canFindContract) {
      return;
    }

    setState((current) => ({
      ...current,
      revealedContractId: getNextIncompleteContract(current.completedContractIds)?.id ?? null
    }));
  };

  const deliverContract = () => {
    if (!canDeliverContract || !revealedContract) {
      return;
    }

    const startedAt = Date.now();

    setState((current) => ({
      ...current,
      activeTimedActivity: {
        type: 'delivery',
        label: `Delivering ${revealedContract.title}`,
        startedAt,
        endsAt: startedAt + DELIVERY_DURATION_MS,
        contractId: revealedContract.id
      }
    }));
  };

  return (
    <main className="app-shell">
      <header>
        <p className="kicker">AI Startup Builder • Early Game</p>
        <h1>Build an AI startup from your laptop</h1>
        <p>
          Grow from zero to your first €100 by collecting data, training your model, and delivering
          customer contracts.
        </p>
      </header>

      <section className="panel">
        <h2>Startup State</h2>
        <ul className="resource-grid">
          <li>
            <strong>Cash</strong>
            <span>€{state.euros}</span>
          </li>
          <li>
            <strong>Rich Uncle Points</strong>
            <span>{richUnclePoints}</span>
          </li>
          <li>
            <strong>Raw Data</strong>
            <span>{state.rawData}</span>
          </li>
          <li>
            <strong>Clean Data</strong>
            <span>{state.cleanData}</span>
          </li>
          <li>
            <strong>Model Quality</strong>
            <span>{state.modelQuality}</span>
          </li>
          <li>
            <strong>Phase</strong>
            <span>{startupPhase}</span>
          </li>
          <li>
            <strong>Current Activity</strong>
            <span>{currentActivityText}</span>
          </li>
          <li>
            <strong>Hardware</strong>
            <span>{STARTER_HARDWARE.displayName}</span>
          </li>
          <li>
            <strong>Training Speed</strong>
            <span>{STARTER_HARDWARE.trainingSpeed.toFixed(1)}x</span>
          </li>
        </ul>
        <details className="milestone-details">
          <summary>Upcoming Rich Uncle milestones</summary>
          <p>
            Earn 1 Rich Uncle Point for each cash milestone. Points are future prestige-style currency
            and cannot be spent yet.
          </p>
          <ul>
            {upcomingCashMilestones.map((milestone) => (
              <li key={milestone}>€{milestone.toLocaleString('en-US')} cash milestone</li>
            ))}
          </ul>
        </details>
      </section>

      <section className="panel">
        <h2>Timed Activity</h2>
        {state.activeTimedActivity && activeProgress ? (
          <div className="progress-wrap" aria-live="polite">
            <p>
              {state.activeTimedActivity.label} • {activeProgress.secondsRemaining}s remaining
            </p>
            <div className="progress-track" role="progressbar" aria-valuenow={activeProgress.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${activeProgress.percent}%` }} />
            </div>
          </div>
        ) : (
          <p>No timed activity active.</p>
        )}
      </section>

      <section className="panel">
        <h2>Contract Board</h2>
        {revealedContract ? (
          <>
            <div className="contract-card">
              <h3>{revealedContract.title}</h3>
              <p>Required Model Quality: {revealedContract.requiredModelQuality}</p>
              <p>Reward: €{revealedContract.rewardEuros}</p>
            </div>
            <div className="actions contract-actions">
              <button type="button" onClick={deliverContract} disabled={!canDeliverContract}>
                Deliver Contract (timed)
              </button>
            </div>
          </>
        ) : (
          <>
            <p>{nextContract ? 'No contract revealed yet.' : 'All current contracts completed.'}</p>
            {nextContract ? (
              <div className="actions contract-actions">
                <button type="button" onClick={findContract} disabled={!canFindContract}>
                  Find Contract
                </button>
              </div>
            ) : null}
          </>
        )}
        {nextContract ? (
          <p className="contract-hint">Next available contract unlocks in order and cannot be repeated.</p>
        ) : null}
      </section>

      <section className="panel">
        <h2>Operations</h2>
        <div className="actions">
          <button type="button" onClick={collectRawData} disabled={!canCollectData}>
            Collect Data (+1 raw)
          </button>
          <button type="button" onClick={cleanDataset} disabled={!canCleanData}>
            Clean Dataset (-1 raw, usually +1 clean)
          </button>
          <label className="training-input">
            Clean data for training
            <input
              type="number"
              min={1}
              max={Math.max(1, state.cleanData)}
              step={1}
              value={selectedTrainingCleanData}
              onChange={(event) => setSelectedTrainingCleanData(Number(event.target.value))}
              disabled={isBusy || state.cleanData === 0}
            />
          </label>
          <button type="button" onClick={startTrainingCycle} disabled={!canStartTraining}>
            Train Model (timed)
          </button>
        </div>
        <p className="training-hint">
          Training takes about {getTrainingDurationMs(Math.max(1, selectedTrainingCleanData), STARTER_HARDWARE) / 1000}s
          at current hardware speed. Larger runs usually improve model quality more, but outcomes vary.
        </p>
      </section>

      {hasReachedMilestone ? (
        <section className="panel win-panel" aria-live="polite">
          <h2>Milestone reached</h2>
          <p>
            Rich Uncle awarded {richUnclePoints} total point{richUnclePoints === 1 ? '' : 's'} for your
            reached cash milestone{richUnclePoints === 1 ? '' : 's'}.
          </p>
        </section>
      ) : null}
    </main>
  );
}

export default App;
