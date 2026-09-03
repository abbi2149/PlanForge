import type { Minute, WorkCenterId } from '@planforge/model';
import type { DowntimeEvent } from './types.js';

export function meanTimeBetweenFailures(events: readonly DowntimeEvent[], workCenterId: WorkCenterId, observedMinutes: Minute): number {
  const failures = events.filter((event) => event.workCenterId === workCenterId && event.category === 'breakdown').length;
  if (failures === 0) return Number.POSITIVE_INFINITY;
  const repairMinutes = events
    .filter((event) => event.workCenterId === workCenterId && event.category === 'breakdown')
    .reduce((sum, event) => sum + (event.end - event.start), 0);
  return Math.max(0, observedMinutes - repairMinutes) / failures;
}

export function meanTimeToRepair(events: readonly DowntimeEvent[], workCenterId: WorkCenterId): number {
  const failures = events.filter((event) => event.workCenterId === workCenterId && event.category === 'breakdown');
  if (failures.length === 0) return 0;
  return failures.reduce((sum, event) => sum + (event.end - event.start), 0) / failures.length;
}
