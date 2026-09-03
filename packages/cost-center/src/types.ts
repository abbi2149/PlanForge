import type { MoneyMinor, WorkCenterId } from '@planforge/model';

export interface CostCenterBudget {
  readonly workCenterId: WorkCenterId;
  readonly fixedMinor: MoneyMinor;
  readonly variableMinor: MoneyMinor;
  readonly period: number;
}

export interface CostCenterActual {
  readonly workCenterId: WorkCenterId;
  readonly fixedMinor: MoneyMinor;
  readonly variableMinor: MoneyMinor;
  readonly period: number;
}

export interface CostCenterVariance {
  readonly workCenterId: WorkCenterId;
  readonly period: number;
  readonly budgetMinor: MoneyMinor;
  readonly actualMinor: MoneyMinor;
  readonly varianceMinor: number;
  readonly varianceBasisPoints: number;
}
