import type { Minute, Quantity, WorkCenterId } from '@planforge/model';

export interface OeeInput {
  readonly workCenterId: WorkCenterId;
  readonly plannedProductionMinutes: Minute;
  readonly downtimeMinutes: Minute;
  readonly idealCycleMinutes: number;
  readonly totalCount: Quantity;
  readonly goodCount: Quantity;
}

export interface OeeResult {
  readonly workCenterId: WorkCenterId;
  readonly availabilityBasisPoints: number;
  readonly performanceBasisPoints: number;
  readonly qualityBasisPoints: number;
  readonly oeeBasisPoints: number;
}
