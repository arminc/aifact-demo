import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const trainingDurationMs = 6000;
const deliveryDurationMs = 5000;

const getStartupStateSection = () => {
  const section = screen.getByRole('heading', { name: /startup state/i }).closest('section');

  if (!section) {
    throw new Error('Could not find Startup State section');
  }

  return section;
};

const getActionsSection = () => {
  const section = screen.getByRole('heading', { name: /actions/i }).closest('section');

  if (!section) {
    throw new Error('Could not find Actions section');
  }

  return section;
};

const getActionButton = (name: RegExp) => within(getActionsSection()).getByRole('button', { name });

const getResourceValue = (label: RegExp) => {
  const resourceLabel = within(getStartupStateSection()).getByText(label, { selector: 'strong' });
  const resourceItem = resourceLabel.closest('li');

  if (!resourceItem) {
    throw new Error(`Could not find resource item for label ${label.toString()}`);
  }

  const value = resourceItem.querySelector('span')?.textContent;

  if (!value) {
    throw new Error(`Could not find resource value for label ${label.toString()}`);
  }

  return value;
};

describe('App MVP gameplay loop', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('shows initial startup state', () => {
    render(<App />);

    expect(getResourceValue(/cash/i)).toBe('€0');
    expect(getResourceValue(/raw data/i)).toBe('0');
    expect(getResourceValue(/clean data/i)).toBe('0');
    expect(getResourceValue(/model quality/i)).toBe('0');
    expect(getResourceValue(/phase/i)).toBe('Foundation setup');
  });

  it('runs the MVP loop through first €100 milestone', () => {
    render(<App />);

    const collectDataButton = getActionButton(/collect data/i);
    const cleanDataButton = getActionButton(/clean dataset/i);
    const trainModelButton = getActionButton(/train model/i);
    const findContractButton = getActionButton(/find contract/i);
    const deliverContractButton = getActionButton(/deliver contract/i);

    expect(cleanDataButton).toBeDisabled();
    expect(trainModelButton).toBeDisabled();

    fireEvent.click(collectDataButton);
    expect(getResourceValue(/raw data/i)).toBe('1');
    expect(cleanDataButton).toBeEnabled();

    fireEvent.click(cleanDataButton);
    expect(getResourceValue(/raw data/i)).toBe('0');
    expect(getResourceValue(/clean data/i)).toBe('1');

    fireEvent.click(collectDataButton);
    fireEvent.click(collectDataButton);
    fireEvent.click(cleanDataButton);
    fireEvent.click(cleanDataButton);
    expect(getResourceValue(/clean data/i)).toBe('3');
    expect(trainModelButton).toBeEnabled();

    fireEvent.click(trainModelButton);
    expect(getResourceValue(/clean data/i)).toBe('0');
    expect(getResourceValue(/current activity/i)).toBe('Training model on laptop');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    expect(collectDataButton).toBeDisabled();
    expect(cleanDataButton).toBeDisabled();
    expect(trainModelButton).toBeDisabled();
    expect(findContractButton).toBeDisabled();
    expect(deliverContractButton).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(trainingDurationMs);
    });

    expect(screen.getByText(/no timed activity active\./i)).toBeInTheDocument();
    expect(getResourceValue(/model quality/i)).toBe('8');

    fireEvent.click(findContractButton);
    expect(screen.getByRole('heading', { name: /starter ai pilot contract/i })).toBeInTheDocument();
    expect(screen.getByText(/required model quality: 8/i)).toBeInTheDocument();
    expect(deliverContractButton).toBeEnabled();

    fireEvent.click(deliverContractButton);
    expect(getResourceValue(/current activity/i)).toBe('Delivering Starter AI Pilot Contract');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    expect(collectDataButton).toBeDisabled();
    expect(cleanDataButton).toBeDisabled();
    expect(trainModelButton).toBeDisabled();
    expect(findContractButton).toBeDisabled();
    expect(deliverContractButton).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(deliveryDurationMs);
    });

    expect(getResourceValue(/cash/i)).toBe('€100');
    expect(screen.getByRole('heading', { name: /milestone reached/i })).toBeInTheDocument();
    expect(
      screen.getByText(/reached €100 — your first ai startup milestone is complete/i)
    ).toBeInTheDocument();
  });
});
