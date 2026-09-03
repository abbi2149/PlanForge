import type { Minute, WorkCenterId } from '@planforge/model';

export interface CycleObservation {
  readonly workCenterId: WorkCenterId;
  readonly cycleMinutes: Minute;
  readonly targetMinutes: Minute;
  readonly sequence: number;
}

export interface CycleTimeResult {
  readonly workCenterId: WorkCenterId;
  readonly averageMinutes: number;
  readonly minimumMinutes: Minute;
  readonly maximumMinutes: Minute;
  readonly targetAdherenceBasisPoints: number;
}
