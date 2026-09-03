import type { CycleObservation } from './types.js';

export function cycleTrend(observations: readonly CycleObservation[]): number {
  const sorted = [...observations].sort((a, b) => a.sequence - b.sequence);
  if (sorted.length < 2) return 0;
  return (sorted.at(-1)!.cycleMinutes - sorted[0]!.cycleMinutes) / (sorted.length - 1);
}

export function outlierCycles(observations: readonly CycleObservation[], maximumMinutes: number): readonly CycleObservation[] {
  return observations.filter((entry) => entry.cycleMinutes > maximumMinutes).sort((a, b) => b.cycleMinutes - a.cycleMinutes);
}
