import type { Minute } from '@planforge/model';
import type { BalanceTask } from './types.js';

export function theoreticalMinimumStations(tasks: readonly BalanceTask[], cycleTime: Minute): number {
  if (cycleTime <= 0) return Number.POSITIVE_INFINITY;
  return Math.ceil(tasks.reduce((sum, task) => sum + task.duration, 0) / cycleTime);
}

export function minimumFeasibleCycleTime(tasks: readonly BalanceTask[]): Minute {
  return Math.max(0, ...tasks.map((task) => task.duration)) as Minute;
}

export function targetCycleTime(availableMinutes: Minute, demandUnits: number): Minute | null {
  if (availableMinutes <= 0 || !Number.isSafeInteger(demandUnits) || demandUnits <= 0) return null;
  return Math.floor(availableMinutes / demandUnits) as Minute;
}
