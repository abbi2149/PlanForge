import type { LeadTimeResult } from './types.js';

export interface LeadTimeSummary {
  readonly averageMinutes: number;
  readonly medianMinutes: number;
  readonly averageValueAddedBasisPoints: number;
}

export function summarizeLeadTimes(results: readonly LeadTimeResult[]): LeadTimeSummary {
  if (results.length === 0) return { averageMinutes: 0, medianMinutes: 0, averageValueAddedBasisPoints: 0 };
  const sorted = [...results].sort((a, b) => a.totalMinutes - b.totalMinutes);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? ((sorted[mid - 1]?.totalMinutes ?? 0) + (sorted[mid]?.totalMinutes ?? 0)) / 2
    : sorted[mid]!.totalMinutes;
  return {
    averageMinutes: results.reduce((sum, result) => sum + result.totalMinutes, 0) / results.length,
    medianMinutes: median,
    averageValueAddedBasisPoints: Math.round(results.reduce((sum, result) => sum + result.valueAddedBasisPoints, 0) / results.length),
  };
}
