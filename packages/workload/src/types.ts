import type { Minute, WorkCenterId } from '@planforge/model';

export interface WorkloadBucket {
  readonly workCenterId: WorkCenterId;
  readonly bucketStart: Minute;
  readonly bucketEnd: Minute;
  readonly requiredMinutes: Minute;
  readonly availableMinutes: Minute;
}

export interface WorkloadSummary {
  readonly workCenterId: WorkCenterId;
  readonly peakLoadBasisPoints: number;
  readonly averageLoadBasisPoints: number;
  readonly overloadedBuckets: number;
}
