import type { ItemId, Quantity } from '@planforge/model';

export interface OrderMixEntry {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
}

export interface OrderMixResult {
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly shareBasisPoints: number;
  readonly rank: number;
}
