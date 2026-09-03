import type { Minute } from '@planforge/model';

export interface FulfillmentRecord {
  readonly orderId: string;
  readonly promisedMinute: Minute;
  readonly completedMinute: Minute;
  readonly requestedQuantity: number;
  readonly shippedQuantity: number;
}

export interface ServiceLevelResult {
  readonly orderCount: number;
  readonly onTimeBasisPoints: number;
  readonly inFullBasisPoints: number;
  readonly otifBasisPoints: number;
  readonly averageLateMinutes: number;
}
