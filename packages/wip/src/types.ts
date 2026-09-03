import type { ItemId, Minute, Quantity, WorkCenterId } from '@planforge/model';

export interface WipEntry {
  readonly orderId: string;
  readonly itemId: ItemId;
  readonly workCenterId: WorkCenterId;
  readonly quantity: Quantity;
  readonly enteredMinute: Minute;
}

export interface WipSummary {
  readonly workCenterId: WorkCenterId;
  readonly orderCount: number;
  readonly quantity: Quantity;
  readonly averageAgeMinutes: number;
  readonly maximumAgeMinutes: Minute;
}
