import type { Minute, MoneyMinor } from '@planforge/model';

export interface LaborRate {
  readonly workerId: string;
  readonly regularMinorPerMinute: MoneyMinor;
  readonly overtimeMinorPerMinute: MoneyMinor;
}

export interface LaborCostLine {
  readonly workerId: string;
  readonly regularMinutes: Minute;
  readonly overtimeMinutes: Minute;
  readonly regularCostMinor: MoneyMinor;
  readonly overtimeCostMinor: MoneyMinor;
  readonly totalCostMinor: MoneyMinor;
}
