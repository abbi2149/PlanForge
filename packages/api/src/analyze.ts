import { bottleneckCenters, emptyLedger, addReservation } from '@planforge/capacity';
import { maintenanceConflicts } from '@planforge/maintenance';
import type { ProductionPlan, WorkCenterId } from '@planforge/model';
import { scheduleMetrics } from '@planforge/scheduler';
import type { FactoryModel } from './types.js';

export interface FactoryAnalysis {
  readonly schedule: ReturnType<typeof scheduleMetrics>;
  readonly bottlenecks: readonly string[];
  readonly maintenanceConflicts: number;
}

export function analyzeFactory(model: FactoryModel, plan: ProductionPlan): FactoryAnalysis {
  let ledger = emptyLedger();
  for (const operation of plan.operations) {
    ledger = addReservation(ledger, {
      orderId: operation.orderId,
      operationId: operation.operationId,
      workCenterId: operation.workCenterId,
      start: operation.startMinute,
      end: operation.endMinute,
      units: 1,
    });
  }
  const centers = [...new Set(model.calendar.shifts.map((shift) => shift.workCenterId))].sort() as WorkCenterId[];
  const bottlenecks = bottleneckCenters(
    model.calendar,
    ledger,
    centers,
    model.calendar.horizonStart,
    model.calendar.horizonEnd,
  ).map((entry) => entry.workCenterId);
  return {
    schedule: scheduleMetrics(model.orders, plan.operations),
    bottlenecks,
    maintenanceConflicts: maintenanceConflicts(model.maintenanceWindows ?? [], plan.operations).length,
  };
}
