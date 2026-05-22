import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DELIVERY_DURATION_MS, getTrainingDurationMs, STARTER_HARDWARE } from './gameRules';

const getStartupStateSection = () => {
  const section = screen.getByRole('heading', { name: /startup state/i }).closest('section');
  if (!section) throw new Error('Could not find Startup State section');
  return section;
};

const getActionsSection = () => {
  const section = screen.getByRole('heading', { name: /actions/i }).closest('section');
  if (!section) throw new Error('Could not find Actions section');
  return section;
};

const getActionButton = (name: RegExp) => within(getActionsSection()).getByRole('button', { name });

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

  it('shows initial startup state with hardware and no MVP text', () => {
    render(<App />);

    expect(getResourceValue(/cash/i)).toBe('€0');
    expect(getResourceValue(/hardware/i)).toBe('Laptop');
    expect(getResourceValue(/training speed/i)).toBe('1.0x');
    expect(screen.queryByText(/mvp/i)).not.toBeInTheDocument();
  });

  it('validates variable training input and applies duration by selected data', () => {
    render(<App />);

    const collectDataButton = getActionButton(/collect data/i);
    const cleanDataButton = getActionButton(/clean dataset/i);
    const trainModelButton = getActionButton(/train model/i);
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

    const collectDataButton = getActionButton(/collect data/i);
    const cleanDataButton = getActionButton(/clean dataset/i);
    const trainModelButton = getActionButton(/train model/i);
    const findContractButton = getActionButton(/find contract/i);
    const deliverContractButton = getActionButton(/deliver contract/i);

    while (Number(getResourceValue(/model quality/i)) < 8) {
      while (Number(getResourceValue(/clean data/i)) < 3) {
        fireEvent.click(collectDataButton);
        fireEvent.click(cleanDataButton);
      }
      fireEvent.click(trainModelButton);
      act(() => {
        vi.advanceTimersByTime(getTrainingDurationMs(1, STARTER_HARDWARE) * 4);
      });
    }

    fireEvent.click(findContractButton);
    expect(screen.getByRole('heading', { name: /starter ai pilot contract/i })).toBeInTheDocument();
    expect(screen.getByText(/required model quality: 8/i)).toBeInTheDocument();
    expect(screen.getByText(/reward: €90/i)).toBeInTheDocument();

    fireEvent.click(deliverContractButton);
    act(() => {
      vi.advanceTimersByTime(DELIVERY_DURATION_MS);
    });

    expect(getResourceValue(/cash/i)).toBe('€90');
    fireEvent.click(findContractButton);
    expect(screen.getByRole('heading', { name: /regional support bot rollout/i })).toBeInTheDocument();
  });
});
