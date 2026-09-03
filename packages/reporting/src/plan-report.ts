import type { ProductionPlan } from '@planforge/model';
import type { ProductionReport } from './types.js';
import { summarizePlan } from './summary.js';

export function buildPlanReport(plan: ProductionPlan): ProductionReport {
  const summary = summarizePlan(plan);
  const operationRows = [...plan.operations]
    .sort((a, b) => a.startMinute - b.startMinute || a.orderId.localeCompare(b.orderId))
    .map((entry) => ({
      order: entry.orderId,
      operation: entry.operationId,
      workCenter: entry.workCenterId,
      start: entry.startMinute,
      end: entry.endMinute,
      quantity: entry.quantity,
    }));
  return {
    title: `Production plan ${plan.name}`,
    plan: { name: plan.name, digest: plan.digest },
    sections: [
      {
        title: 'Summary',
        rows: [{ operations: summary.operationCount, orders: summary.orderCount, workCenters: summary.workCenterCount, firstStart: summary.firstStart, lastEnd: summary.lastEnd, warnings: summary.warningCount }],
      },
      { title: 'Operations', rows: operationRows },
      { title: 'Warnings', rows: plan.warnings.map((warning, index) => ({ index: index + 1, warning })) },
    ],
  };
}
