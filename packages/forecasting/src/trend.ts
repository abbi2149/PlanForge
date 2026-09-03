import type { ItemId, Quantity } from '@planforge/model';
import type { DemandPoint, ForecastPoint } from './types.js';

export interface LinearTrend {
  readonly itemId: ItemId;
  readonly intercept: number;
  readonly slopePerPeriod: number;
  readonly observations: number;
}

export function fitLinearTrend(points: readonly DemandPoint[], itemId: ItemId): LinearTrend | null {
  const series = points.filter((point) => point.itemId === itemId).sort((a, b) => a.period - b.period);
  if (series.length === 0) return null;
  if (series.length === 1) {
    return { itemId, intercept: series[0]!.quantity, slopePerPeriod: 0, observations: 1 };
  }
  const meanX = series.reduce((sum, point) => sum + point.period, 0) / series.length;
  const meanY = series.reduce((sum, point) => sum + point.quantity, 0) / series.length;
  let numerator = 0;
  let denominator = 0;
  for (const point of series) {
    numerator += (point.period - meanX) * (point.quantity - meanY);
    denominator += (point.period - meanX) ** 2;
  }
  const slopePerPeriod = denominator === 0 ? 0 : numerator / denominator;
  return {
    itemId,
    intercept: meanY - slopePerPeriod * meanX,
    slopePerPeriod,
    observations: series.length,
  };
}

export function trendForecast(
  points: readonly DemandPoint[],
  itemId: ItemId,
  futurePeriods: readonly number[],
): readonly ForecastPoint[] {
  const trend = fitLinearTrend(points, itemId);
  if (!trend) return [];
  return [...futurePeriods]
    .sort((a, b) => a - b)
    .map((period) => ({
      period,
      itemId,
      quantity: Math.max(0, Math.round(trend.intercept + trend.slopePerPeriod * period)) as Quantity,
      method: 'linear-trend',
    }));
}
