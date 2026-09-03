import type { Minute, Quantity, WorkCenterId } from '@planforge/model';

export interface ThroughputObservation {
  readonly workCenterId: WorkCenterId;
  readonly start: Minute;
  readonly end: Minute;
  readonly goodQuantity: Quantity;
  readonly totalQuantity: Quantity;
}

export interface ThroughputRate {
  readonly workCenterId: WorkCenterId;
  readonly unitsPerHour: number;
  readonly goodUnitsPerHour: number;
  readonly yieldBasisPoints: number;
}
