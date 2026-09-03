import type { Quantity } from '@planforge/model';
import type { DemandPoint, ForecastPoint } from './types.js';

export function seasonalNaiveForecast(
  series: readonly DemandPoint[],
  seasonLength: number,
  periods: number,
): readonly ForecastPoint[] {
  if (series.length < seasonLength || seasonLength <= 0 || periods <= 0) return [];
  const sorted = [...series].sort((a, b) => a.period - b.period);
  const season = sorted.slice(-seasonLength);
  const itemId = sorted[0]!.itemId;
  const start = sorted.at(-1)!.period + 1;
  return Array.from({ length: periods }, (_, index) => ({
    period: start + index,
    itemId,
    quantity: season[index % season.length]!.quantity as Quantity,
    method: `seasonal-naive:${seasonLength}`,
  }));
}
