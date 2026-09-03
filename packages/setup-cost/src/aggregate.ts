import type { MoneyMinor } from '@planforge/model';
import type { SetupCostResult } from './types.js';

export function totalSetupCost(results: readonly SetupCostResult[]): MoneyMinor {
  return results.reduce((sum, result) => sum + result.totalMinor, 0) as MoneyMinor;
}

export function setupCostByCenter(results: readonly SetupCostResult[]): Readonly<Record<string, MoneyMinor>> {
  const totals: Record<string, MoneyMinor> = {};
  for (const result of results) totals[result.workCenterId] = ((totals[result.workCenterId] ?? 0) + result.totalMinor) as MoneyMinor;
  return Object.fromEntries(Object.entries(totals).sort(([a], [b]) => a.localeCompare(b))) as Readonly<Record<string, MoneyMinor>>;
}
