import type { ProductionPlan } from '@planforge/model';
import type { ReportSection } from './types.js';

export function operationTimelineSection(plan: ProductionPlan): ReportSection {
  const rows = [...plan.operations]
    .sort(
      (a, b) =>
        a.startMinute - b.startMinute ||
        a.workCenterId.localeCompare(b.workCenterId) ||
        a.orderId.localeCompare(b.orderId) ||
        a.operationId.localeCompare(b.operationId),
    )
    .map((operation) => ({
      order: operation.orderId,
      operation: operation.operationId,
      workCenter: operation.workCenterId,
      start: operation.startMinute,
      end: operation.endMinute,
      duration: operation.endMinute - operation.startMinute,
      quantity: operation.quantity,
    }));
  return { title: 'Operation timeline', rows };
}

export function workCenterTimelineSection(plan: ProductionPlan): ReportSection {
  const centers = [...new Set(plan.operations.map((operation) => operation.workCenterId))].sort();
  const rows = centers.map((workCenterId) => {
    const operations = plan.operations.filter((operation) => operation.workCenterId === workCenterId);
    const firstStart = operations.length === 0 ? 0 : Math.min(...operations.map((operation) => operation.startMinute));
    const lastEnd = operations.length === 0 ? 0 : Math.max(...operations.map((operation) => operation.endMinute));
    const busyMinutes = operations.reduce(
      (sum, operation) => sum + operation.endMinute - operation.startMinute,
      0,
    );
    return {
      workCenter: workCenterId,
      operationCount: operations.length,
      firstStart,
      lastEnd,
      spanMinutes: Math.max(0, lastEnd - firstStart),
      busyMinutes,
    };
  });
  return { title: 'Work center timeline', rows };
}
