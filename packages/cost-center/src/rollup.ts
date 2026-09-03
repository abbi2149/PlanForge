import type { MoneyMinor } from '@planforge/model';
import type { CostCenterVariance } from './types.js';

export interface CostCenterRollup {
  readonly budgetMinor: MoneyMinor;
  readonly actualMinor: MoneyMinor;
  readonly varianceMinor: number;
  readonly centers: number;
}

export function rollupCostCenters(variances: readonly CostCenterVariance[]): CostCenterRollup {
  const budgetMinor = variances.reduce((sum, entry) => sum + entry.budgetMinor, 0) as MoneyMinor;
  const actualMinor = variances.reduce((sum, entry) => sum + entry.actualMinor, 0) as MoneyMinor;
  return {
    budgetMinor,
    actualMinor,
    varianceMinor: actualMinor - budgetMinor,
    centers: new Set(variances.map((entry) => entry.workCenterId)).size,
  };
}
