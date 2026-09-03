import type { VarianceResult } from './types.js';

export interface VarianceSummary {
  readonly count: number;
  readonly favorable: number;
  readonly unfavorable: number;
  readonly meanAbsoluteBasisPoints: number;
}

export function summarizeVariances(results: readonly VarianceResult[]): VarianceSummary {
  return {
    count: results.length,
    favorable: results.filter((result) => result.favorable).length,
    unfavorable: results.filter((result) => !result.favorable).length,
    meanAbsoluteBasisPoints: results.length === 0 ? 0 : Math.round(results.reduce((sum, result) => sum + Math.abs(result.basisPoints), 0) / results.length),
  };
}
