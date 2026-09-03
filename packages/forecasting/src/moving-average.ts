import type { ForecastPoint } from './types.js';
import type { DemandPoint } from './types.js';
import type { Quantity } from '@planforge/model';

export function movingAverageForecast(series: readonly DemandPoint[], window: number, periods: number): readonly ForecastPoint[] {
  if (!Number.isSafeInteger(window) || window <= 0 || !Number.isSafeInteger(periods) || periods <= 0 || series.length === 0) return [];
  const sorted = [...series].sort((a, b) => a.period - b.period);
  const values = sorted.map((point) => point.quantity as number);
  const itemId = sorted[0]!.itemId;
  const result: ForecastPoint[] = [];
  let nextPeriod = sorted.at(-1)!.period + 1;
  for (let step = 0; step < periods; step += 1) {
    const sample = values.slice(Math.max(0, values.length - window));
    const quantity = Math.round(sample.reduce((sum, value) => sum + value, 0) / sample.length) as Quantity;
    result.push({ period: nextPeriod, itemId, quantity, method: `moving-average:${window}` });
    values.push(quantity);
    nextPeriod += 1;
  }
  return result;
}
