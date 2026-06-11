import { STARTER_HARDWARE } from '../gameRules';
import type { StartupState } from '../gameState';

type StartupStatePanelProps = {
  state: StartupState;
  richUnclePoints: number;
  startupPhase: string;
  currentActivityText: string;
  upcomingCashMilestones: number[];
};

export function StartupStatePanel({
  state,
  richUnclePoints,
  startupPhase,
  currentActivityText,
  upcomingCashMilestones
}: StartupStatePanelProps) {
  return (
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
  );
}
