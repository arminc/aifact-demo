import { getTrainingDurationMs, STARTER_HARDWARE } from '../gameRules';

type OperationsPanelProps = {
  cleanData: number;
  isBusy: boolean;
  selectedTrainingCleanData: number;
  canCollectData: boolean;
  canCleanData: boolean;
  canStartTraining: boolean;
  onCollectRawData: () => void;
  onCleanDataset: () => void;
  onSelectedTrainingCleanDataChange: (cleanData: number) => void;
  onStartTrainingCycle: () => void;
};

export function OperationsPanel({
  cleanData,
  isBusy,
  selectedTrainingCleanData,
  canCollectData,
  canCleanData,
  canStartTraining,
  onCollectRawData,
  onCleanDataset,
  onSelectedTrainingCleanDataChange,
  onStartTrainingCycle
}: OperationsPanelProps) {
  return (
    <section className="panel">
      <h2>Operations</h2>
      <div className="actions">
        <button type="button" onClick={onCollectRawData} disabled={!canCollectData}>
          Collect Data (+1 raw)
        </button>
        <button type="button" onClick={onCleanDataset} disabled={!canCleanData}>
          Clean Dataset (-1 raw, usually +1 clean)
        </button>
        <label className="training-input">
          Clean data for training
          <input
            type="number"
            min={1}
            max={Math.max(1, cleanData)}
            step={1}
            value={selectedTrainingCleanData}
            onChange={(event) => onSelectedTrainingCleanDataChange(Number(event.target.value))}
            disabled={isBusy || cleanData === 0}
          />
        </label>
        <button type="button" onClick={onStartTrainingCycle} disabled={!canStartTraining}>
          Train Model (timed)
        </button>
      </div>
      <p className="training-hint">
        Training takes about {getTrainingDurationMs(Math.max(1, selectedTrainingCleanData), STARTER_HARDWARE) / 1000}s
        at current hardware speed. Larger runs usually improve model quality more, but outcomes vary.
      </p>
    </section>
  );
}
