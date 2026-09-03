import type { Minute, ScheduledOperation, WorkCenterId } from '@planforge/model';
import type { MaintenanceWindow } from './types.js';

export interface MaintenanceImpact {
  readonly workCenterId: WorkCenterId;
  readonly maintenanceMinutes: Minute;
  readonly affectedOperationCount: number;
  readonly overlapMinutes: Minute;
}

function overlapMinutes(
  leftStart: Minute,
  leftEnd: Minute,
  rightStart: Minute,
  rightEnd: Minute,
): Minute {
  return Math.max(0, Math.min(leftEnd, rightEnd) - Math.max(leftStart, rightStart)) as Minute;
}

export function maintenanceImpactByCenter(
  windows: readonly MaintenanceWindow[],
  operations: readonly ScheduledOperation[],
): readonly MaintenanceImpact[] {
  const centers = [...new Set(windows.map((window) => window.workCenterId))].sort();
  return centers.map((workCenterId) => {
    const centerWindows = windows.filter((window) => window.workCenterId === workCenterId);
    const centerOperations = operations.filter((operation) => operation.workCenterId === workCenterId);
    const affected = new Set<string>();
    let overlap = 0;
    for (const window of centerWindows) {
      for (const operation of centerOperations) {
        const minutes = overlapMinutes(
          window.start,
          window.end,
          operation.startMinute,
          operation.endMinute,
        );
        if (minutes > 0) {
          overlap += minutes;
          affected.add(`${operation.orderId}:${operation.operationId}`);
        }
      }
    }
    return {
      workCenterId,
      maintenanceMinutes: centerWindows.reduce((sum, window) => sum + (window.end - window.start), 0) as Minute,
      affectedOperationCount: affected.size,
      overlapMinutes: overlap as Minute,
    };
  });
}

export function maintenanceFreeMinutes(
  windows: readonly MaintenanceWindow[],
  workCenterId: WorkCenterId,
  start: Minute,
  end: Minute,
): Minute {
  if (end <= start) return 0 as Minute;
  const intervals = windows
    .filter((window) => window.workCenterId === workCenterId && window.start < end && start < window.end)
    .map((window) => ({ start: Math.max(start, window.start), end: Math.min(end, window.end) }))
    .sort((a, b) => a.start - b.start || a.end - b.end);
  let blocked = 0;
  let cursor = start as number;
  for (const interval of intervals) {
    const effectiveStart = Math.max(cursor, interval.start);
    if (interval.end > effectiveStart) blocked += interval.end - effectiveStart;
    cursor = Math.max(cursor, interval.end);
  }
  return Math.max(0, end - start - blocked) as Minute;
}
