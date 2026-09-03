import type { Minute } from '@planforge/model';
import type { WorkerAvailability } from './types.js';

export function workerAvailable(
  availability: readonly WorkerAvailability[],
  workerId: string,
  start: Minute,
  end: Minute,
): boolean {
  return availability.some((entry) => entry.workerId === workerId && entry.start <= start && entry.end >= end);
}

export function availableMinutes(
  availability: readonly WorkerAvailability[],
  workerId: string,
  start: Minute,
  end: Minute,
): Minute {
  const total = availability
    .filter((entry) => entry.workerId === workerId && entry.start < end && start < entry.end)
    .reduce((sum, entry) => sum + Math.max(0, Math.min(end, entry.end) - Math.max(start, entry.start)), 0);
  return total as Minute;
}

export function nextWorkerAvailability(
  availability: readonly WorkerAvailability[],
  workerId: string,
  atOrAfter: Minute,
): WorkerAvailability | null {
  return availability
    .filter((entry) => entry.workerId === workerId && entry.end > atOrAfter)
    .sort((a, b) => a.start - b.start || a.end - b.end)[0] ?? null;
}
