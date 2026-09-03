import type { Minute, OperationId, OrderId, TimeRange, WorkCenterId } from '@planforge/model';

export interface CapacityReservation extends TimeRange {
  readonly orderId: OrderId;
  readonly operationId: OperationId;
  readonly workCenterId: WorkCenterId;
  readonly units: number;
}

export interface CapacityLedger {
  readonly reservations: readonly CapacityReservation[];
}

export interface CapacityConflict {
  readonly workCenterId: WorkCenterId;
  readonly atMinute: Minute;
  readonly requiredUnits: number;
  readonly availableUnits: number;
  readonly reservations: readonly CapacityReservation[];
}

export interface UtilizationBucket extends TimeRange {
  readonly workCenterId: WorkCenterId;
  readonly reservedUnitMinutes: number;
  readonly availableUnitMinutes: number;
  readonly utilizationBasisPoints: number;
}
