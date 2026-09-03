import type { ItemId, Minute, OperationId, OrderId, Quantity, WorkCenterId } from '@planforge/model';

export interface WorkOrder {
  readonly id: OrderId;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly releaseMinute: Minute;
  readonly dueMinute: Minute;
  readonly status: 'planned' | 'released' | 'running' | 'completed' | 'cancelled';
}

export interface OperationProgress {
  readonly workOrderId: OrderId;
  readonly operationId: OperationId;
  readonly workCenterId: WorkCenterId;
  readonly completedQuantity: Quantity;
  readonly scrapQuantity: Quantity;
  readonly minute: Minute;
}
