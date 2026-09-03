import { rangesOverlap, type ScheduledOperation } from '@planforge/model';
import type { MaintenanceConflict, MaintenanceWindow } from './types.js';

export function maintenanceConflicts(
  windows: readonly MaintenanceWindow[],
  operations: readonly ScheduledOperation[],
): readonly MaintenanceConflict[] {
  const conflicts: MaintenanceConflict[] = [];
  for (const window of windows) {
    for (const operation of operations) {
      if (window.workCenterId !== operation.workCenterId) continue;
      if (!rangesOverlap(window, { start: operation.startMinute, end: operation.endMinute })) continue;
      conflicts.push({ maintenanceId: window.id, orderId: operation.orderId, operationId: operation.operationId });
    }
  }
  return conflicts.sort((a, b) => a.maintenanceId.localeCompare(b.maintenanceId) || a.orderId.localeCompare(b.orderId));
}
