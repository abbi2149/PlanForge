import type { Minute, Quantity } from '@planforge/model';

export interface FlowObservation {
  readonly orderId: string;
  readonly releaseMinute: Minute;
  readonly startMinute: Minute;
  readonly completionMinute: Minute;
  readonly quantity: Quantity;
}

export interface FlowMetrics {
  readonly orderId: string;
  readonly waitMinutes: Minute;
  readonly processingSpanMinutes: Minute;
  readonly totalFlowMinutes: Minute;
  readonly velocityUnitsPerHour: number;
}
