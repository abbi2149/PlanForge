import type { Quantity } from '@planforge/model';
import type { OperationProgress, WorkOrder } from './types.js';

export interface WorkOrderProgress {
  readonly workOrderId: string;
  readonly completedQuantity: Quantity;
  readonly scrapQuantity: Quantity;
  readonly completionBasisPoints: number;
}

export function workOrderProgress(order: WorkOrder, entries: readonly OperationProgress[]): WorkOrderProgress {
  const relevant = entries.filter((entry) => entry.workOrderId === order.id);
  const completedQuantity = Math.max(0, ...relevant.map((entry) => entry.completedQuantity)) as Quantity;
  const scrapQuantity = relevant.reduce((sum, entry) => sum + entry.scrapQuantity, 0) as Quantity;
  return {
    workOrderId: order.id,
    completedQuantity,
    scrapQuantity,
    completionBasisPoints: order.quantity === 0 ? 10_000 : Math.min(10_000, Math.round((completedQuantity * 10_000) / order.quantity)),
  };
}
