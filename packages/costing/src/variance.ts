import type { MoneyMinor } from '@planforge/model';

export interface CostVariance {
  readonly plannedMinor: MoneyMinor;
  readonly actualMinor: MoneyMinor;
  readonly varianceMinor: number;
  readonly varianceBasisPoints: number;
}

export function costVariance(plannedMinor: MoneyMinor, actualMinor: MoneyMinor): CostVariance {
  const varianceMinor = actualMinor - plannedMinor;
  return {
    plannedMinor,
    actualMinor,
    varianceMinor,
    varianceBasisPoints: plannedMinor === 0 ? 0 : Math.round((varianceMinor * 10_000) / plannedMinor),
  };
}
