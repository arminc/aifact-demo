type MilestonePanelProps = {
  richUnclePoints: number;
};

export function MilestonePanel({ richUnclePoints }: MilestonePanelProps) {
  return (
    <section className="panel win-panel" aria-live="polite">
      <h2>Milestone reached</h2>
      <p>
        Rich Uncle awarded {richUnclePoints} total point{richUnclePoints === 1 ? '' : 's'} for your
        reached cash milestone{richUnclePoints === 1 ? '' : 's'}.
      </p>
    </section>
  );
}
