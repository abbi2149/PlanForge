import type { OeeResult } from './types.js';

export function averageOee(results: readonly OeeResult[]): number {
  if (results.length === 0) return 0;
  return Math.round(results.reduce((sum, result) => sum + result.oeeBasisPoints, 0) / results.length);
}

export function weightedOee(results: readonly { readonly result: OeeResult; readonly weight: number }[]): number {
  const totalWeight = results.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
  if (totalWeight === 0) return 0;
  return Math.round(results.reduce((sum, entry) => sum + entry.result.oeeBasisPoints * Math.max(0, entry.weight), 0) / totalWeight);
}
