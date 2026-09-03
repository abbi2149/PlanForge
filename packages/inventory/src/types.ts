import type { ItemId, LotId, Minute, Quantity } from '@planforge/model';

export interface InventoryLot {
  readonly id: LotId;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly availableMinute: Minute;
  readonly expiresMinute?: Minute;
}

export interface InventoryReceipt {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly minute: Minute;
  readonly reference: string;
}

export interface InventoryDemand {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly minute: Minute;
  readonly reference: string;
}

export interface InventoryPosition {
  readonly itemId: ItemId;
  readonly minute: Minute;
  readonly onHand: Quantity;
  readonly shortage: Quantity;
}

export interface LotAllocation {
  readonly lotId: LotId;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
}
