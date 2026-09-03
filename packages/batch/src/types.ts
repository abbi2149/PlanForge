import type { ItemId, LotId, Minute, Quantity } from '@planforge/model';

export interface BatchDefinition {
  readonly id: LotId;
  readonly itemId: ItemId;
  readonly targetQuantity: Quantity;
  readonly minimumQuantity: Quantity;
  readonly maximumQuantity: Quantity;
  readonly releaseMinute: Minute;
}

export interface BatchAllocation {
  readonly batchId: LotId;
  readonly orderId: string;
  readonly quantity: Quantity;
}

export interface BatchStatus {
  readonly batchId: LotId;
  readonly allocated: Quantity;
  readonly remaining: Quantity;
  readonly full: boolean;
}
