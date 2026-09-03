import type { Minute, ScheduledOperation, WorkCenterId } from '@planforge/model';

export interface UtilizationWindow {
  readonly workCenterId: WorkCenterId;
  readonly start: Minute;
  readonly end: Minute;
  readonly busyMinutes: Minute;
  readonly utilizationBasisPoints: number;
  readonly operationCount: number;
}

export function busyMinutesInWindow(
  operations: readonly ScheduledOperation[],
  workCenterId: WorkCenterId,
  start: Minute,
  end: Minute,
): Minute {
  if (end <= start) return 0 as Minute;
  const intervals = operations
    .filter((operation) => operation.workCenterId === workCenterId)
    .map((operation) => ({
      start: Math.max(start, operation.startMinute),
      end: Math.min(end, operation.endMinute),
    }))
    .filter((range) => range.end > range.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  let busy = 0;
  let cursor = start as number;
  for (const interval of intervals) {
    if (interval.end <= cursor) continue;
    const effectiveStart = Math.max(cursor, interval.start);
    busy += interval.end - effectiveStart;
    cursor = Math.max(cursor, interval.end);
  }
  return busy as Minute;
}

export function utilizationWindow(
  operations: readonly ScheduledOperation[],
  workCenterId: WorkCenterId,
  start: Minute,
  end: Minute,
): UtilizationWindow {
  const busyMinutes = busyMinutesInWindow(operations, workCenterId, start, end);
  const span = Math.max(0, end - start);
  return {
    workCenterId,
    start,
    end,
    busyMinutes,
    utilizationBasisPoints: span === 0 ? 0 : Math.min(10_000, Math.round((busyMinutes * 10_000) / span)),
    operationCount: operations.filter(
      (operation) =>
        operation.workCenterId === workCenterId && operation.startMinute < end && start < operation.endMinute,
    ).length,
  };
}

export function utilizationByWorkCenter(
  operations: readonly ScheduledOperation[],
  start: Minute,
  end: Minute,
): readonly UtilizationWindow[] {
  const centers = [...new Set(operations.map((operation) => operation.workCenterId))].sort();
  return centers.map((center) => utilizationWindow(operations, center, start, end));
}
