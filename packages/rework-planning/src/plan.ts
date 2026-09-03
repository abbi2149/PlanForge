import type { Minute } from '@planforge/model';
import type { ReworkDemand, ReworkPlanLine } from './types.js';

export function planRework(demands: readonly ReworkDemand[], minutesPerUnit: Minute): readonly ReworkPlanLine[] {
  const centerReady = new Map<string, Minute>();
  const result: ReworkPlanLine[] = [];
  for (const demand of [...demands].sort((a, b) => a.dueMinute - b.dueMinute || a.orderId.localeCompare(b.orderId))) {
    const start = Math.max(demand.availableMinute, centerReady.get(demand.workCenterId) ?? 0) as Minute;
    const end = (start + demand.quantity * minutesPerUnit) as Minute;
    centerReady.set(demand.workCenterId, end);
    result.push({ orderId: demand.orderId, workCenterId: demand.workCenterId, start, end, quantity: demand.quantity });
  }
  return result;
}
