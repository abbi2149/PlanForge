import type { CostCenterVariance } from './types.js';

export function unfavorableCostCenters(variances: readonly CostCenterVariance[]): readonly CostCenterVariance[] {
  return variances
    .filter((entry) => entry.varianceMinor > 0)
    .sort((a, b) => b.varianceMinor - a.varianceMinor || a.workCenterId.localeCompare(b.workCenterId));
}

export function variancesForPeriod(variances: readonly CostCenterVariance[], period: number): readonly CostCenterVariance[] {
  return variances.filter((entry) => entry.period === period).sort((a, b) => a.workCenterId.localeCompare(b.workCenterId));
}
