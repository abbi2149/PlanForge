import type { ProductionPlan } from '@planforge/model';
import type { PlanSummary } from './types.js';

export function summarizePlan(plan: ProductionPlan): PlanSummary {
  return {
    name: plan.name,
    digest: plan.digest,
    operationCount: plan.operations.length,
    orderCount: new Set(plan.operations.map((entry) => entry.orderId)).size,
    workCenterCount: new Set(plan.operations.map((entry) => entry.workCenterId)).size,
    firstStart: Math.min(...plan.operations.map((entry) => entry.startMinute), 0),
    lastEnd: Math.max(...plan.operations.map((entry) => entry.endMinute), 0),
    warningCount: plan.warnings.length,
  };
}
