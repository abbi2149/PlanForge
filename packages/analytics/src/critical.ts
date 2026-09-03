import type { ScheduledOperation } from '@planforge/model';

export interface CriticalOperation {
  readonly orderId: string;
  readonly operationId: string;
  readonly duration: number;
  readonly rank: number;
}

export function longestOperations(operations: readonly ScheduledOperation[], limit = 10): readonly CriticalOperation[] {
  return [...operations]
    .map((entry) => ({
      orderId: entry.orderId,
      operationId: entry.operationId,
      duration: entry.endMinute - entry.startMinute,
      rank: 0,
    }))
    .sort((a, b) => b.duration - a.duration || a.orderId.localeCompare(b.orderId) || a.operationId.localeCompare(b.operationId))
    .slice(0, Math.max(0, limit))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
