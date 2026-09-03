import type { ProductionPlan } from '@planforge/model';
import type { Disruption } from './types.js';

export interface OperationExposure {
  readonly disruptionId: string;
  readonly orderId: string;
  readonly operationId: string;
  readonly overlapMinutes: number;
  readonly severityBasisPoints: number;
}

export function operationExposure(plan: ProductionPlan, disruptions: readonly Disruption[]): readonly OperationExposure[] {
  const result: OperationExposure[] = [];
  for (const disruption of disruptions) {
    for (const operation of plan.operations) {
      if (operation.workCenterId !== disruption.workCenterId) continue;
      const overlap = Math.max(0, Math.min(operation.endMinute, disruption.end) - Math.max(operation.startMinute, disruption.start));
      if (overlap > 0) result.push({ disruptionId: disruption.id, orderId: operation.orderId, operationId: operation.operationId, overlapMinutes: overlap, severityBasisPoints: disruption.severityBasisPoints });
    }
  }
  return result.sort((a, b) => a.disruptionId.localeCompare(b.disruptionId) || a.orderId.localeCompare(b.orderId));
}
