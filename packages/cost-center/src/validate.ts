import { failure, success, type ModelResult } from '@planforge/model';
import type { CostCenterBudget } from './types.js';

export function validateCostCenterBudgets(budgets: readonly CostCenterBudget[]): ModelResult<readonly CostCenterBudget[]> {
  const keys = new Set<string>();
  for (const budget of budgets) {
    const key = `${budget.workCenterId}\u0000${budget.period}`;
    if (keys.has(key) || budget.fixedMinor < 0 || budget.variableMinor < 0 || !Number.isSafeInteger(budget.period)) {
      return failure({ code: 'COST_CENTER_BUDGET', message: `invalid budget ${key}` });
    }
    keys.add(key);
  }
  return success([...budgets]);
}
