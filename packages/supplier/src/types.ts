import type { ItemId, Minute, Quantity } from '@planforge/model';

export interface SupplierDelivery {
  readonly supplierId: string;
  readonly itemId: ItemId;
  readonly promisedMinute: Minute;
  readonly receivedMinute: Minute;
  readonly orderedQuantity: Quantity;
  readonly acceptedQuantity: Quantity;
}

export interface SupplierScorecard {
  readonly supplierId: string;
  readonly deliveryCount: number;
  readonly onTimeBasisPoints: number;
  readonly fillRateBasisPoints: number;
  readonly averageDelayMinutes: number;
}

export interface SupplierQualification {
  readonly supplierId: string;
  readonly minimumOnTimeBasisPoints: number;
  readonly minimumFillRateBasisPoints: number;
}
