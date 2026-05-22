import { useEffect, useMemo, useState } from 'react';
import './App.css';

type ContractDefinition = {
  id: string;
  title: string;
  requiredModelQuality: number;
  rewardEuros: number;
};

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
  rawData: number;
  cleanData: number;
  modelQuality: number;
  revealedContractId: string | null;
  activeTimedActivity: ActiveTimedActivity | null;
};

const TRAINING_DURATION_MS = 6000;
const DELIVERY_DURATION_MS = 5000;
const WIN_EUROS = 100;

const CONTRACTS: ContractDefinition[] = [
  {
    id: 'starter-ai-pilot',
    title: 'Starter AI Pilot Contract',
    requiredModelQuality: 8,
    rewardEuros: 100
  }
];

const initialState: StartupState = {
  euros: 0,
  rawData: 0,
  cleanData: 0,
  modelQuality: 0,
  revealedContractId: null,
  activeTimedActivity: null
};

const calculateTrainingQualityGain = (cleanDataUsed: number, trainingDurationMs: number) => {
  const durationSeconds = trainingDurationMs / 1000;
  return Math.round(cleanDataUsed * 1.5 + durationSeconds * 0.6);
};

function App() {
  const [state, setState] = useState<StartupState>(initialState);
  const [now, setNow] = useState(() => Date.now());

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
        const qualityGain = calculateTrainingQualityGain(
          current.activeTimedActivity.trainingInputCleanData ?? 3,
          current.activeTimedActivity.endsAt - current.activeTimedActivity.startedAt
        );

        return {
          ...current,
          modelQuality: current.modelQuality + qualityGain,
          activeTimedActivity: null
        };
      }

      const deliveredContractId = current.activeTimedActivity.contractId;
      const deliveredContract = CONTRACTS.find((contract) => contract.id === deliveredContractId);

      if (!deliveredContract) {
        return {
          ...current,
          activeTimedActivity: null
        };
      }

      return {
        ...current,
        euros: current.euros + deliveredContract.rewardEuros,
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
    () => CONTRACTS.find((contract) => contract.id === state.revealedContractId) ?? null,
    [state.revealedContractId]
  );

  const isBusy = state.activeTimedActivity !== null;
  const hasWon = state.euros >= WIN_EUROS;

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
  const canStartTraining = !isBusy && state.cleanData >= 3;
  const canFindContract = !isBusy && !state.revealedContractId;
  const canDeliverContract =
    !isBusy &&
    !!revealedContract &&
    state.modelQuality >= revealedContract.requiredModelQuality;

  const currentActivityText = useMemo(() => {
    if (state.activeTimedActivity) {
      return state.activeTimedActivity.label;
    }

    if (hasWon) {
      return 'Reached €100 — your first AI startup milestone is complete';
    }

    return 'Idle — choose your next startup action';
  }, [hasWon, state.activeTimedActivity]);

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
      cleanData: current.cleanData + 1
    }));
  };

  const startTrainingCycle = () => {
    if (!canStartTraining) {
      return;
    }

    const startedAt = Date.now();

    setState((current) => ({
      ...current,
      cleanData: current.cleanData - 3,
      activeTimedActivity: {
        type: 'training',
        label: 'Training model on laptop',
        startedAt,
        endsAt: startedAt + TRAINING_DURATION_MS,
        trainingInputCleanData: 3
      }
    }));
  };

  const findContract = () => {
    if (!canFindContract) {
      return;
    }

    setState((current) => ({
      ...current,
      revealedContractId: CONTRACTS[0]?.id ?? null
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
        <p className="kicker">AI Startup Builder • MVP Loop</p>
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
        </ul>
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
          <div className="contract-card">
            <h3>{revealedContract.title}</h3>
            <p>Required Model Quality: {revealedContract.requiredModelQuality}</p>
            <p>Reward: €{revealedContract.rewardEuros}</p>
          </div>
        ) : (
          <p>No contract revealed yet.</p>
        )}
      </section>

      <section className="panel">
        <h2>Actions</h2>
        <div className="actions">
          <button type="button" onClick={collectRawData} disabled={!canCollectData}>
            Collect Data (+1 raw)
          </button>
          <button type="button" onClick={cleanDataset} disabled={!canCleanData}>
            Clean Dataset (-1 raw, +1 clean)
          </button>
          <button type="button" onClick={startTrainingCycle} disabled={!canStartTraining}>
            Train Model (-3 clean, timed)
          </button>
          <button type="button" onClick={findContract} disabled={!canFindContract}>
            Find Contract
          </button>
          <button type="button" onClick={deliverContract} disabled={!canDeliverContract}>
            Deliver Contract (timed)
          </button>
        </div>
      </section>

      {hasWon ? (
        <section className="panel win-panel" aria-live="polite">
          <h2>Milestone reached</h2>
          <p>You earned your first €100. MVP completion achieved.</p>
        </section>
      ) : null}
    </main>
  );
}

export default App;
