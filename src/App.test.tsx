import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { CONTRACT_LADDER, DELIVERY_DURATION_MS, getTrainingDurationMs, STARTER_HARDWARE } from './gameRules';

const getStartupStateSection = () => {
  const section = screen.getByRole('heading', { name: /startup state/i }).closest('section');
  if (!section) throw new Error('Could not find Startup State section');
  return section;
};

const getOperationsSection = () => {
  const section = screen.getByRole('heading', { name: /operations/i }).closest('section');
  if (!section) throw new Error('Could not find Operations section');
  return section;
};

const getContractBoardSection = () => {
  const section = screen.getByRole('heading', { name: /contract board/i }).closest('section');
  if (!section) throw new Error('Could not find Contract Board section');
  return section;
};

const getOperationButton = (name: RegExp) => within(getOperationsSection()).getByRole('button', { name });
const getContractBoardButton = (name: RegExp) => within(getContractBoardSection()).getByRole('button', { name });

const advanceTimers = (durationMs: number) => {
  act(() => {
    vi.advanceTimersByTime(durationMs);
  });
};

const getResourceValue = (label: RegExp) => {
  const resourceLabel = within(getStartupStateSection()).getByText(label, { selector: 'strong' });
  const resourceItem = resourceLabel.closest('li');
  if (!resourceItem) throw new Error(`Missing resource item for ${label}`);
  const value = resourceItem.querySelector('span')?.textContent;
  if (!value) throw new Error(`Missing resource value for ${label}`);
  return value;
};

describe('App gameplay loop', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const collectCleanData = (amount: number) => {
    const collectDataButton = getOperationButton(/collect data/i);
    const cleanDataButton = getOperationButton(/clean dataset/i);

    for (let i = 0; i < amount; i += 1) {
      fireEvent.click(collectDataButton);
      fireEvent.click(cleanDataButton);
    }
  };

  const trainWithCleanData = (amount: number) => {
    collectCleanData(amount);
    fireEvent.change(screen.getByRole('spinbutton', { name: /clean data for training/i }), {
      target: { value: String(amount) }
    });
    fireEvent.click(getOperationButton(/train model/i));
    advanceTimers(getTrainingDurationMs(amount, STARTER_HARDWARE));
  };

  const trainUntilQuality = (targetQuality: number) => {
    while (Number(getResourceValue(/model quality/i)) < targetQuality) {
      trainWithCleanData(10);
    }
  };

  const deliverNextContract = (requiredModelQuality: number) => {
    trainUntilQuality(requiredModelQuality);
    fireEvent.click(getContractBoardButton(/find contract/i));
    fireEvent.click(getContractBoardButton(/deliver contract/i));
    advanceTimers(DELIVERY_DURATION_MS);
  };

  it('shows initial startup state with hardware and no MVP text', () => {
    render(<App />);

    expect(getResourceValue(/cash/i)).toBe('€0');
    expect(getResourceValue(/rich uncle points/i)).toBe('0');
    expect(getResourceValue(/hardware/i)).toBe('Laptop');
    expect(getResourceValue(/training speed/i)).toBe('1.0x');
    expect(screen.getByRole('heading', { name: /operations/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /actions/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/mvp/i)).not.toBeInTheDocument();
  });

  it('keeps contract controls on the Contract Board and operations focused on startup work', () => {
    render(<App />);

    const operations = getOperationsSection();
    expect(within(operations).getByRole('button', { name: /collect data/i })).toBeInTheDocument();
    expect(within(operations).getByRole('button', { name: /clean dataset/i })).toBeInTheDocument();
    expect(within(operations).getByRole('spinbutton', { name: /clean data for training/i })).toBeInTheDocument();
    expect(within(operations).getByRole('button', { name: /train model/i })).toBeInTheDocument();
    expect(within(operations).queryByRole('button', { name: /find contract/i })).not.toBeInTheDocument();
    expect(within(operations).queryByRole('button', { name: /deliver contract/i })).not.toBeInTheDocument();

    const contractBoard = getContractBoardSection();
    expect(within(contractBoard).getByRole('button', { name: /find contract/i })).toBeInTheDocument();
    expect(within(contractBoard).queryByRole('button', { name: /deliver contract/i })).not.toBeInTheDocument();
  });

  it('validates variable training input and applies duration by selected data', () => {
    render(<App />);

    const collectDataButton = getOperationButton(/collect data/i);
    const cleanDataButton = getOperationButton(/clean dataset/i);
    const trainModelButton = getOperationButton(/train model/i);
    const trainingInput = screen.getByRole('spinbutton', { name: /clean data for training/i });

    for (let i = 0; i < 3; i += 1) {
      fireEvent.click(collectDataButton);
      fireEvent.click(cleanDataButton);
    }

    fireEvent.change(trainingInput, { target: { value: '4' } });
    expect(trainModelButton).toBeDisabled();

    fireEvent.change(trainingInput, { target: { value: '2' } });
    expect(trainModelButton).toBeEnabled();
    expect(screen.getByText(/outcomes vary/i)).toBeInTheDocument();

    fireEvent.click(trainModelButton);
    expect(getResourceValue(/clean data/i)).toBe('1');

    act(() => {
      vi.advanceTimersByTime(getTrainingDurationMs(2, STARTER_HARDWARE));
    });

    expect(screen.getByText(/no timed activity active/i)).toBeInTheDocument();
    expect(Number(getResourceValue(/model quality/i))).toBeGreaterThan(0);
  });

  it('offers next incomplete contract and prevents repeat offering', () => {
    render(<App />);

    const collectDataButton = getOperationButton(/collect data/i);
    const cleanDataButton = getOperationButton(/clean dataset/i);
    const trainModelButton = getOperationButton(/train model/i);

    while (Number(getResourceValue(/model quality/i)) < 8) {
      while (Number(getResourceValue(/clean data/i)) < 3) {
        fireEvent.click(collectDataButton);
        fireEvent.click(cleanDataButton);
      }
      fireEvent.click(trainModelButton);
      advanceTimers(getTrainingDurationMs(1, STARTER_HARDWARE) * 4);
    }

    fireEvent.click(getContractBoardButton(/find contract/i));
    expect(screen.getByRole('heading', { name: /starter ai pilot contract/i })).toBeInTheDocument();
    expect(screen.getByText(/required model quality: 8/i)).toBeInTheDocument();
    expect(screen.getByText(/reward: €90/i)).toBeInTheDocument();
    expect(getContractBoardButton(/deliver contract/i)).toBeEnabled();

    fireEvent.click(getContractBoardButton(/deliver contract/i));
    advanceTimers(DELIVERY_DURATION_MS);

    expect(getResourceValue(/cash/i)).toBe('€90');
    fireEvent.click(getContractBoardButton(/find contract/i));
    expect(screen.getByRole('heading', { name: /regional support bot rollout/i })).toBeInTheDocument();
  });

  it('disables Contract Board delivery until the revealed contract quality requirement is met', () => {
    render(<App />);

    fireEvent.click(getContractBoardButton(/find contract/i));

    expect(screen.getByRole('heading', { name: /starter ai pilot contract/i })).toBeInTheDocument();
    expect(getContractBoardButton(/deliver contract/i)).toBeDisabled();
  });

  it('reveals only the next few Rich Uncle milestones without spend or restart controls', () => {
    render(<App />);

    const summary = screen.getByText(/upcoming rich uncle milestones/i);
    const details = summary.closest('details');
    expect(details).not.toHaveAttribute('open');

    fireEvent.click(summary);

    expect(details).toHaveAttribute('open');
    expect(screen.getByText(/future prestige-style currency/i)).toBeInTheDocument();
    expect(screen.getByText(/cannot be spent yet/i)).toBeInTheDocument();
    expect(screen.getByText(/€100 cash milestone/i)).toBeInTheDocument();
    expect(screen.getByText(/€1,000 cash milestone/i)).toBeInTheDocument();
    expect(screen.getByText(/€10,000 cash milestone/i)).toBeInTheDocument();
    expect(screen.queryByText(/€100,000 cash milestone/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /restart|reset|prestige|spend/i })).not.toBeInTheDocument();
  });

  it('awards Rich Uncle Points through the timed contract delivery path at €100 and €1,000', () => {
    render(<App />);

    deliverNextContract(CONTRACT_LADDER[0].requiredModelQuality);
    expect(getResourceValue(/cash/i)).toBe('€90');
    expect(getResourceValue(/rich uncle points/i)).toBe('0');

    deliverNextContract(CONTRACT_LADDER[1].requiredModelQuality);
    expect(getResourceValue(/cash/i)).toBe('€220');
    expect(getResourceValue(/rich uncle points/i)).toBe('1');

    deliverNextContract(CONTRACT_LADDER[2].requiredModelQuality);
    expect(getResourceValue(/cash/i)).toBe('€420');
    expect(getResourceValue(/rich uncle points/i)).toBe('1');

    for (const contract of CONTRACT_LADDER.slice(3, 7)) {
      deliverNextContract(contract.requiredModelQuality);
    }

    expect(getResourceValue(/cash/i)).toBe('€1210');
    expect(getResourceValue(/rich uncle points/i)).toBe('2');
    expect(screen.getByText(/rich uncle awarded 2 total points/i)).toBeInTheDocument();
  });
});
