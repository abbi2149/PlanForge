import type { OrderMixResult } from './types.js';

export function mixConcentrationBasisPoints(results: readonly OrderMixResult[], top = 3): number {
  return results.slice(0, Math.max(0, top)).reduce((sum, result) => sum + result.shareBasisPoints, 0);
}

export function longTailItems(results: readonly OrderMixResult[], maximumShareBasisPoints: number): readonly OrderMixResult[] {
  return results.filter((result) => result.shareBasisPoints <= maximumShareBasisPoints).sort((a, b) => a.shareBasisPoints - b.shareBasisPoints);
}
