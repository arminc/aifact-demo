import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ContractBoard } from './components/ContractBoard';
import { MilestonePanel } from './components/MilestonePanel';
import { OperationsPanel } from './components/OperationsPanel';
import { StartupStatePanel } from './components/StartupStatePanel';
import { TimedActivityPanel } from './components/TimedActivityPanel';
import {
  DELIVERY_DURATION_MS,
  getNextIncompleteContract,
  getTrainingDurationMs,
  resolveCleaningOutcome,
  STARTER_HARDWARE
} from './gameRules';
import { getGameViewModel } from './gameSelectors';
import { initialStartupState, resolveCompletedTimedActivity, type StartupState } from './gameState';

function App() {
  const [state, setState] = useState<StartupState>(initialStartupState);
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

      return resolveCompletedTimedActivity(current);
    });
  }, [now, state.activeTimedActivity]);

  const viewModel = useMemo(
    () => getGameViewModel(state, selectedTrainingCleanData, now),
    [now, selectedTrainingCleanData, state]
  );

  const collectRawData = () => {
    if (!viewModel.canCollectData) {
      return;
    }

    setState((current) => ({
      ...current,
      rawData: current.rawData + 1
    }));
  };

  const cleanDataset = () => {
    if (!viewModel.canCleanData) {
      return;
    }

    setState((current) => ({
      ...current,
      rawData: current.rawData - 1,
      cleanData: current.cleanData + resolveCleaningOutcome().producedCleanData
    }));
  };

  const startTrainingCycle = () => {
    if (!viewModel.canStartTraining) {
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
    if (!viewModel.canFindContract) {
      return;
    }

    setState((current) => ({
      ...current,
      revealedContractId: getNextIncompleteContract(current.completedContractIds)?.id ?? null
    }));
  };

  const deliverContract = () => {
    const revealedContract = viewModel.revealedContract;

    if (!viewModel.canDeliverContract || !revealedContract) {
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

      <StartupStatePanel
        state={state}
        richUnclePoints={viewModel.richUnclePoints}
        startupPhase={viewModel.startupPhase}
        currentActivityText={viewModel.currentActivityText}
        upcomingCashMilestones={viewModel.upcomingCashMilestones}
      />

      <TimedActivityPanel
        activeTimedActivity={state.activeTimedActivity}
        activeProgress={viewModel.activeProgress}
      />

      <ContractBoard
        revealedContract={viewModel.revealedContract}
        nextContract={viewModel.nextContract}
        canFindContract={viewModel.canFindContract}
        canDeliverContract={viewModel.canDeliverContract}
        onFindContract={findContract}
        onDeliverContract={deliverContract}
      />

      <OperationsPanel
        cleanData={state.cleanData}
        isBusy={viewModel.isBusy}
        selectedTrainingCleanData={selectedTrainingCleanData}
        canCollectData={viewModel.canCollectData}
        canCleanData={viewModel.canCleanData}
        canStartTraining={viewModel.canStartTraining}
        onCollectRawData={collectRawData}
        onCleanDataset={cleanDataset}
        onSelectedTrainingCleanDataChange={setSelectedTrainingCleanData}
        onStartTrainingCycle={startTrainingCycle}
      />

      {viewModel.hasReachedMilestone ? <MilestonePanel richUnclePoints={viewModel.richUnclePoints} /> : null}
    </main>
  );
}

export default App;
