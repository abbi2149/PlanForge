import type { DemandOrder, ProductionPlan } from '@planforge/model';
import type { PlanAnalytics } from './types.js';
import { orderKpis } from './orders.js';
import { workCenterKpis } from './work-center.js';

export function analyzePlan(plan: ProductionPlan, orders: readonly DemandOrder[]): PlanAnalytics {
  return {
    planDigest: plan.digest,
    workCenters: workCenterKpis(plan.operations),
    orders: orderKpis(orders, plan.operations),
    makespan: Math.max(0, ...plan.operations.map((entry) => entry.endMinute)) as PlanAnalytics['makespan'],
  };
}
