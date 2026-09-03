import type { ReworkDemand, ReworkPlanLine } from './types.js';

export function lateRework(demands: readonly ReworkDemand[], plan: readonly ReworkPlanLine[]): readonly string[] {
  const due = new Map(demands.map((entry) => [entry.orderId, entry.dueMinute]));
  return plan.filter((entry) => entry.end > (due.get(entry.orderId) ?? Number.MAX_SAFE_INTEGER)).map((entry) => entry.orderId).sort();
}
