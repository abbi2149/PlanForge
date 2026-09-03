import type { Minute, OperationId, OrderId, Quantity, WorkCenterId } from '@planforge/model';

export interface ReworkDemand {
  readonly orderId: OrderId;
  readonly sourceOperationId: OperationId;
  readonly workCenterId: WorkCenterId;
  readonly quantity: Quantity;
  readonly availableMinute: Minute;
  readonly dueMinute: Minute;
}

export interface ReworkPlanLine {
  readonly orderId: OrderId;
  readonly workCenterId: WorkCenterId;
  readonly start: Minute;
  readonly end: Minute;
  readonly quantity: Quantity;
}
