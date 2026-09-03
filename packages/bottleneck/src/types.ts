import type { Minute, WorkCenterId } from '@planforge/model';

export interface BottleneckObservation {
  readonly workCenterId: WorkCenterId;
  readonly availableMinutes: Minute;
  readonly requiredMinutes: Minute;
  readonly queueMinutes: Minute;
}

export interface BottleneckScore {
  readonly workCenterId: WorkCenterId;
  readonly loadBasisPoints: number;
  readonly queueBasisPoints: number;
  readonly score: number;
  readonly rank: number;
}
