import type { ScheduledOperation, WorkCenterId } from '@planforge/model';
import type { WorkCenterKpi } from './types.js';

export function workCenterKpis(operations: readonly ScheduledOperation[]): readonly WorkCenterKpi[] {
  const centers = [...new Set(operations.map((entry) => entry.workCenterId))].sort() as WorkCenterId[];
  return centers.map((workCenterId) => {
    const entries = operations.filter((entry) => entry.workCenterId === workCenterId);
    const first = Math.min(...entries.map((entry) => entry.startMinute));
    const last = Math.max(...entries.map((entry) => entry.endMinute));
    const busy = entries.reduce((sum, entry) => sum + (entry.endMinute - entry.startMinute), 0);
    const span = Math.max(0, last - first);
    return {
      workCenterId,
      operationCount: entries.length,
      busyMinutes: busy as WorkCenterKpi['busyMinutes'],
      spanMinutes: span as WorkCenterKpi['spanMinutes'],
      utilizationBasisPoints: span === 0 ? 0 : Math.min(10_000, Math.round((busy * 10_000) / span)),
      averageOperationMinutes: entries.length === 0 ? 0 : busy / entries.length,
    };
  });
}
