import type { MoneyMinor, WorkCenterId } from '@planforge/model';

export interface SetupCostRate {
  readonly workCenterId: WorkCenterId;
  readonly laborMinorPerMinute: MoneyMinor;
  readonly downtimeMinorPerMinute: MoneyMinor;
  readonly consumablesMinor: MoneyMinor;
}

export interface SetupCostResult {
  readonly workCenterId: WorkCenterId;
  readonly minutes: number;
  readonly laborMinor: MoneyMinor;
  readonly downtimeMinor: MoneyMinor;
  readonly consumablesMinor: MoneyMinor;
  readonly totalMinor: MoneyMinor;
}
