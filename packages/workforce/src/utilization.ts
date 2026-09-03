import type { Minute } from '@planforge/model';
import type { StaffingAssignment, WorkerAvailability } from './types.js';
import { availableMinutes } from './availability.js';

export interface WorkerUtilization {
  readonly workerId: string;
  readonly assignedMinutes: Minute;
  readonly availableMinutes: Minute;
  readonly utilizationBasisPoints: number;
}

export function workerUtilization(
  assignments: readonly StaffingAssignment[],
  availability: readonly WorkerAvailability[],
  workerId: string,
  start: Minute,
  end: Minute,
): WorkerUtilization {
  const assigned = assignments
    .filter((entry) => entry.workerId === workerId && entry.start < end && start < entry.end)
    .reduce((sum, entry) => sum + Math.max(0, Math.min(end, entry.end) - Math.max(start, entry.start)), 0) as Minute;
  const available = availableMinutes(availability, workerId, start, end);
  return {
    workerId,
    assignedMinutes: assigned,
    availableMinutes: available,
    utilizationBasisPoints: available === 0 ? 0 : Math.min(10_000, Math.round((assigned * 10_000) / available)),
  };
}
