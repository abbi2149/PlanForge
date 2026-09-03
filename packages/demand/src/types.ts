import type { ItemId, Minute, Quantity } from '@planforge/model';

export interface DemandSignal {
  readonly itemId: ItemId;
  readonly minute: Minute;
  readonly quantity: Quantity;
  readonly source: 'order' | 'forecast' | 'reservation' | 'adjustment';
  readonly reference: string;
}

export interface DemandBucket {
  readonly itemId: ItemId;
  readonly bucket: number;
  readonly quantity: Quantity;
  readonly sources: readonly string[];
}

export interface DemandProfile {
  readonly itemId: ItemId;
  readonly totalQuantity: Quantity;
  readonly peakBucket: number;
  readonly peakQuantity: Quantity;
  readonly buckets: readonly DemandBucket[];
}
