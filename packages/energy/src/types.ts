import type { Minute, TimeRange, WorkCenterId } from '@planforge/model';

export interface EnergyRate extends TimeRange {
  readonly minorPerKwh: number;
  readonly carbonGramsPerKwh: number;
}

export interface WorkCenterEnergyProfile {
  readonly workCenterId: WorkCenterId;
  readonly idleWatts: number;
  readonly runWatts: number;
  readonly setupWatts: number;
}

export interface EnergyUsage {
  readonly workCenterId: WorkCenterId;
  readonly start: Minute;
  readonly end: Minute;
  readonly wattMinutes: number;
  readonly kwh: number;
  readonly costMinor: number;
  readonly carbonGrams: number;
}
