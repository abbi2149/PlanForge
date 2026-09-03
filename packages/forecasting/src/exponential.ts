import type { Quantity } from '@planforge/model';
import type { DemandPoint, ForecastPoint } from './types.js';

export function exponentialSmoothing(
  series: readonly DemandPoint[],
  alphaBasisPoints: number,
  periods: number,
): readonly ForecastPoint[] {
  if (series.length === 0 || periods <= 0 || alphaBasisPoints < 0 || alphaBasisPoints > 10_000) return [];
  const sorted = [...series].sort((a, b) => a.period - b.period);
  let level = sorted[0]!.quantity as number;
  for (const point of sorted.slice(1)) {
    level = Math.round((alphaBasisPoints * point.quantity + (10_000 - alphaBasisPoints) * level) / 10_000);
  }
  const itemId = sorted[0]!.itemId;
  const start = sorted.at(-1)!.period + 1;
  return Array.from({ length: periods }, (_, index) => ({
    period: start + index,
    itemId,
    quantity: Math.max(0, level) as Quantity,
    method: `exponential:${alphaBasisPoints}`,
  }));
}
