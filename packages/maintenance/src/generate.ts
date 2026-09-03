import type { MaintenanceId, Minute } from '@planforge/model';
import type { MaintenancePolicy, MaintenanceWindow } from './types.js';

export function generatePreventiveWindows(policy: MaintenancePolicy, horizonEnd: Minute): readonly MaintenanceWindow[] {
  if (policy.intervalMinutes <= 0 || policy.durationMinutes <= 0) return [];
  const windows: MaintenanceWindow[] = [];
  let due = policy.firstDueMinute;
  let sequence = 1;
  while (due < horizonEnd) {
    windows.push({
      id: `${policy.workCenterId}:PM:${sequence}` as MaintenanceId,
      workCenterId: policy.workCenterId,
      kind: 'preventive',
      description: `Preventive maintenance ${sequence}`,
      start: due,
      end: Math.min(horizonEnd, due + policy.durationMinutes) as Minute,
    });
    due = (due + policy.intervalMinutes) as Minute;
    sequence += 1;
  }
  return windows;
}
