import type { Minute } from '@planforge/model';

export interface PromiseQuote {
  readonly orderId: string;
  readonly requestedMinute: Minute;
  readonly quotedMinute: Minute;
  readonly confidenceBasisPoints: number;
  readonly reason: string;
}

export interface PromiseReview {
  readonly orderId: string;
  readonly quotedMinute: Minute;
  readonly projectedMinute: Minute;
  readonly atRisk: boolean;
  readonly riskMinutes: Minute;
}
