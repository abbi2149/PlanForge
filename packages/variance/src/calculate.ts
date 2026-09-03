import type { VariancePoint, VarianceResult } from './types.js';

export function calculateVariance(point: VariancePoint, lowerIsBetter = true): VarianceResult {
  const absolute = point.actual - point.planned;
  const basisPoints = point.planned === 0 ? 0 : Math.round((absolute * 10_000) / Math.abs(point.planned));
  return {
    key: point.key,
    absolute,
    basisPoints,
    favorable: lowerIsBetter ? absolute <= 0 : absolute >= 0,
  };
}

export function calculateVariances(points: readonly VariancePoint[], lowerIsBetter = true): readonly VarianceResult[] {
  return points.map((point) => calculateVariance(point, lowerIsBetter)).sort((a, b) => Math.abs(b.basisPoints) - Math.abs(a.basisPoints) || a.key.localeCompare(b.key));
}
