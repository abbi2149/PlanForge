import type { Minute, Quantity, WorkCenterId } from '@planforge/model';

export interface SetupObservation {
  readonly workCenterId: WorkCenterId;
  readonly familyFrom: string;
  readonly familyTo: string;
  readonly internalMinutes: Minute;
  readonly externalMinutes: Minute;
}

export interface SetupImprovement {
  readonly workCenterId: WorkCenterId;
  readonly originalMinutes: Minute;
  readonly improvedMinutes: Minute;
  readonly reductionBasisPoints: number;
  readonly convertedToExternalMinutes: Minute;
}

export interface FlowCell {
  readonly workCenterId: WorkCenterId;
  readonly cycleMinutes: number;
  readonly operators: number;
  readonly bufferUnits: Quantity;
}

export interface LeanCellScore {
  readonly taktMinutes: number;
  readonly averageCycleMinutes: number;
  readonly cycleAdherenceBasisPoints: number;
  readonly bufferCoverageCycles: number;
}
