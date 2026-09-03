import { failure, success, type ModelResult } from '@planforge/model';
import type { MaintenancePolicy, MaintenanceWindow } from './types.js';

export function validateMaintenance(
  policies: readonly MaintenancePolicy[],
  windows: readonly MaintenanceWindow[],
): ModelResult<true> {
  for (const policy of policies) {
    if (policy.intervalMinutes <= 0 || policy.durationMinutes <= 0 || policy.durationMinutes >= policy.intervalMinutes) {
      return failure({ code: 'MAINTENANCE_POLICY', message: `invalid maintenance policy for ${policy.workCenterId}` });
    }
  }
  const ids = new Set<string>();
  for (const window of windows) {
    if (ids.has(window.id)) return failure({ code: 'MAINTENANCE_DUPLICATE', message: `duplicate maintenance window ${window.id}` });
    ids.add(window.id);
    if (window.end <= window.start) return failure({ code: 'MAINTENANCE_RANGE', message: `maintenance ${window.id} has invalid range` });
  }
  return success(true);
}
