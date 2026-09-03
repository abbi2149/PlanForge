import type { Minute } from '@planforge/model';

export interface DeliveryWindow {
  readonly id: string;
  readonly earliest: Minute;
  readonly latest: Minute;
}

export interface DeliveryCommitment {
  readonly id: string;
  readonly windowId: string;
  readonly plannedMinute: Minute;
}

export interface DeliveryWindowResult {
  readonly id: string;
  readonly withinWindow: boolean;
  readonly earlyMinutes: Minute;
  readonly lateMinutes: Minute;
}
