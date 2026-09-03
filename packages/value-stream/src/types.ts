import type { Minute, WorkCenterId } from '@planforge/model';

export interface ValueStreamStep {
  readonly id: string;
  readonly workCenterId: WorkCenterId;
  readonly processMinutes: Minute;
  readonly waitMinutes: Minute;
  readonly inventoryUnits: number;
  readonly firstPassYieldBasisPoints: number;
}

export interface ValueStreamMap {
  readonly name: string;
  readonly steps: readonly ValueStreamStep[];
}

export interface ValueStreamMetrics {
  readonly processMinutes: Minute;
  readonly waitMinutes: Minute;
  readonly leadMinutes: Minute;
  readonly processCycleEfficiencyBasisPoints: number;
  readonly rolledYieldBasisPoints: number;
  readonly totalInventoryUnits: number;
}
