import type { ItemId, MoneyMinor, OperationId, OrderId, Quantity, WorkCenterId } from '@planforge/model';

export interface WorkCenterRate {
  readonly workCenterId: WorkCenterId;
  readonly laborMinorPerMinute: MoneyMinor;
  readonly machineMinorPerMinute: MoneyMinor;
  readonly setupMinorPerMinute: MoneyMinor;
}

export interface MaterialRate {
  readonly itemId: ItemId;
  readonly costMinorPerUnit: MoneyMinor;
}

export interface OperationCost {
  readonly operationId: OperationId;
  readonly laborMinor: MoneyMinor;
  readonly machineMinor: MoneyMinor;
  readonly setupMinor: MoneyMinor;
  readonly totalMinor: MoneyMinor;
}

export interface OrderCost {
  readonly orderId: OrderId;
  readonly quantity: Quantity;
  readonly materialMinor: MoneyMinor;
  readonly conversionMinor: MoneyMinor;
  readonly overheadMinor: MoneyMinor;
  readonly totalMinor: MoneyMinor;
}
