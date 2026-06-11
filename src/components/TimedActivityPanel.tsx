import type { ActiveProgress } from '../gameSelectors';
import type { ActiveTimedActivity } from '../gameState';

type TimedActivityPanelProps = {
  activeTimedActivity: ActiveTimedActivity | null;
  activeProgress: ActiveProgress | null;
};

export function TimedActivityPanel({ activeTimedActivity, activeProgress }: TimedActivityPanelProps) {
  return (
    <section className="panel">
      <h2>Timed Activity</h2>
      {activeTimedActivity && activeProgress ? (
        <div className="progress-wrap" aria-live="polite">
          <p>
            {activeTimedActivity.label} • {activeProgress.secondsRemaining}s remaining
          </p>
          <div className="progress-track" role="progressbar" aria-valuenow={activeProgress.percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${activeProgress.percent}%` }} />
          </div>
        </div>
      ) : (
        <p>No timed activity active.</p>
      )}
    </section>
  );
}
