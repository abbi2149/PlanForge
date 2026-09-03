import type { MaintenancePolicy } from './types.js';
import type { Minute } from '@planforge/model';

export function nextMaintenanceDue(policy: MaintenancePolicy, after: Minute): Minute {
  if (after <= policy.firstDueMinute) return policy.firstDueMinute;
  const elapsed = after - policy.firstDueMinute;
  const intervals = Math.ceil(elapsed / policy.intervalMinutes);
  return (policy.firstDueMinute + intervals * policy.intervalMinutes) as Minute;
}

export function maintenanceDueWithin(policy: MaintenancePolicy, start: Minute, end: Minute): boolean {
  const due = nextMaintenanceDue(policy, start);
  return due < end;
}
