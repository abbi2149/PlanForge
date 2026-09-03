import type { Minute } from '@planforge/model';
import type { StaffingAssignment, WorkerAvailability } from './types.js';

export function overtimeMinutes(
  assignments: readonly StaffingAssignment[],
  regularAvailability: readonly WorkerAvailability[],
  workerId: string,
): Minute {
  let overtime = 0;
  for (const assignment of assignments.filter((entry) => entry.workerId === workerId)) {
    const covered = regularAvailability
      .filter((entry) => entry.workerId === workerId && entry.start < assignment.end && assignment.start < entry.end)
      .reduce((sum, entry) => sum + Math.max(0, Math.min(entry.end, assignment.end) - Math.max(entry.start, assignment.start)), 0);
    overtime += Math.max(0, assignment.end - assignment.start - covered);
  }
  return overtime as Minute;
}

export function overtimeCostMinor(minutes: Minute, minorPerMinute: number, multiplierBasisPoints: number): number {
  if (minutes <= 0 || minorPerMinute <= 0) return 0;
  return Math.round((minutes * minorPerMinute * Math.max(0, multiplierBasisPoints)) / 10_000);
}
