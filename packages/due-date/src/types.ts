import type { Minute } from '@planforge/model';

export interface DueDateEstimate {
  readonly orderId: string;
  readonly releaseMinute: Minute;
  readonly processingMinutes: Minute;
  readonly allowanceMinutes: Minute;
  readonly promisedMinute: Minute;
}

export interface DueDatePolicy {
  readonly allowanceBasisPoints: number;
  readonly minimumAllowanceMinutes: Minute;
}
