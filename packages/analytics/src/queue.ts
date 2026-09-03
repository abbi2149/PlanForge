import type { Minute, ScheduledOperation, WorkCenterId } from '@planforge/model';

export interface QueuePoint {
  readonly workCenterId: WorkCenterId;
  readonly minute: Minute;
  readonly queuedOperations: number;
}

export function queueProfile(operations: readonly ScheduledOperation[], workCenterId: WorkCenterId): readonly QueuePoint[] {
  const entries = operations.filter((entry) => entry.workCenterId === workCenterId);
  const points = [...new Set(entries.flatMap((entry) => [entry.startMinute, entry.endMinute]))].sort((a, b) => a - b);
  return points.map((minute) => ({
    workCenterId,
    minute,
    queuedOperations: entries.filter((entry) => entry.startMinute >= minute).length,
  }));
}
