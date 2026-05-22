import { useMemo, useState } from 'react';
import './App.css';

type StartupState = {
  euros: number;
  rawData: number;
  cleanData: number;
  modelQuality: number;
  currentActivity: string;
};

const initialState: StartupState = {
  euros: 1200,
  rawData: 8,
  cleanData: 2,
  modelQuality: 11,
  currentActivity: 'Defining first product hypothesis'
};

function App() {
  const [state, setState] = useState<StartupState>(initialState);

  const startupPhase = useMemo(() => {
    if (state.modelQuality >= 40) {
      return 'Early traction';
    }

    if (state.modelQuality >= 20) {
      return 'Prototype readiness';
    }

    return 'Foundation setup';
  }, [state.modelQuality]);

  const collectRawData = () => {
    setState((current) => ({
      ...current,
      rawData: current.rawData + 1,
      currentActivity: 'Collecting new data sources'
    }));
  };

  const cleanDataset = () => {
    setState((current) => {
      const canClean = current.rawData > 0;

      if (!canClean) {
        return {
          ...current,
          currentActivity: 'Waiting for raw data before cleaning'
        };
      }

      return {
        ...current,
        rawData: current.rawData - 1,
        cleanData: current.cleanData + 1,
        currentActivity: 'Cleaning and labeling dataset'
      };
    });
  };

  const runTrainingCycle = () => {
    setState((current) => ({
      ...current,
      modelQuality: current.modelQuality + 1,
      euros: Math.max(0, current.euros - 60),
      currentActivity: 'Running a lightweight training cycle'
    }));
  };

  return (
    <main className="app-shell">
      <header>
        <p className="kicker">AI Startup Builder • Foundation Slice</p>
        <h1>Build an AI startup from your laptop</h1>
        <p>
          This is the durable browser foundation for the incremental game. State is intentionally
          in-memory only in this first technical slice.
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
            <span>{state.currentActivity}</span>
          </li>
        </ul>
      </section>

      <section className="panel">
        <h2>Placeholder Actions</h2>
        <p>These controls represent future clicker interactions and timed loops.</p>
        <div className="actions">
          <button type="button" onClick={collectRawData}>
            Collect Data (+1 raw)
          </button>
          <button type="button" onClick={cleanDataset}>
            Clean Dataset (-1 raw, +1 clean)
          </button>
          <button type="button" onClick={runTrainingCycle}>
            Run Training (-€60, +1 quality)
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
