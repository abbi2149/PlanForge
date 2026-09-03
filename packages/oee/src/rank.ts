import type { OeeResult } from './types.js';

export function rankOee(results: readonly OeeResult[]): readonly OeeResult[] {
  return [...results].sort((a, b) => b.oeeBasisPoints - a.oeeBasisPoints || a.workCenterId.localeCompare(b.workCenterId));
}

export function belowOeeThreshold(results: readonly OeeResult[], thresholdBasisPoints: number): readonly OeeResult[] {
  return [...rankOee(results.filter((result) => result.oeeBasisPoints < thresholdBasisPoints))].reverse();
}
