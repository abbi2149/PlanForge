import type { MoneyMinor } from '@planforge/model';
import type { CostCenterActual, CostCenterBudget, CostCenterVariance } from './types.js';

export function costCenterVariance(
  budget: CostCenterBudget,
  actual: CostCenterActual,
): CostCenterVariance | null {
  if (budget.workCenterId !== actual.workCenterId || budget.period !== actual.period) return null;
  const budgetMinor = (budget.fixedMinor + budget.variableMinor) as MoneyMinor;
  const actualMinor = (actual.fixedMinor + actual.variableMinor) as MoneyMinor;
  const varianceMinor = actualMinor - budgetMinor;
  return {
    workCenterId: budget.workCenterId,
    period: budget.period,
    budgetMinor,
    actualMinor,
    varianceMinor,
    varianceBasisPoints: budgetMinor === 0 ? 0 : Math.round((varianceMinor * 10_000) / budgetMinor),
  };
}
