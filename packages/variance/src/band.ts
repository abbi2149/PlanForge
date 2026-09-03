import type { VarianceResult } from './types.js';

export type VarianceBand = 'green' | 'amber' | 'red';

export function varianceBand(result: VarianceResult, amberBasisPoints: number, redBasisPoints: number): VarianceBand {
  const magnitude = Math.abs(result.basisPoints);
  if (magnitude >= redBasisPoints) return 'red';
  if (magnitude >= amberBasisPoints) return 'amber';
  return 'green';
}
