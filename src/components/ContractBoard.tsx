import type { ContractDefinition } from '../gameRules';

type ContractBoardProps = {
  revealedContract: ContractDefinition | null;
  nextContract: ContractDefinition | null;
  canFindContract: boolean;
  canDeliverContract: boolean;
  onFindContract: () => void;
  onDeliverContract: () => void;
};

export function ContractBoard({
  revealedContract,
  nextContract,
  canFindContract,
  canDeliverContract,
  onFindContract,
  onDeliverContract
}: ContractBoardProps) {
  return (
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
            <button type="button" onClick={onDeliverContract} disabled={!canDeliverContract}>
              Deliver Contract (timed)
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{nextContract ? 'No contract revealed yet.' : 'All current contracts completed.'}</p>
          {nextContract ? (
            <div className="actions contract-actions">
              <button type="button" onClick={onFindContract} disabled={!canFindContract}>
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
  );
}
