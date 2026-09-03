import type { ItemId, Minute, Quantity } from '@planforge/model';

export interface ReplenishmentPolicy {
  readonly itemId: ItemId;
  readonly reorderPoint: Quantity;
  readonly targetLevel: Quantity;
  readonly leadMinutes: Minute;
  readonly orderMultiple: Quantity;
}

export interface ReplenishmentSignal {
  readonly itemId: ItemId;
  readonly atMinute: Minute;
  readonly projectedOnHand: Quantity;
  readonly orderQuantity: Quantity;
  readonly expectedMinute: Minute;
}
