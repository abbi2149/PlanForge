import type { ItemId, Quantity } from '@planforge/model';
import { forecastMetrics } from './metrics.js';
import { movingAverageForecast } from './moving-average.js';
import type { DemandPoint, ForecastMetrics, ForecastPoint } from './types.js';

export interface BacktestFold {
  readonly trainThroughPeriod: number;
  readonly actual: DemandPoint;
  readonly forecast: ForecastPoint;
  readonly absoluteError: number;
}

export interface ForecastBacktest {
  readonly itemId: ItemId;
  readonly window: number;
  readonly folds: readonly BacktestFold[];
  readonly metrics: ForecastMetrics;
}

export function movingAverageBacktest(
  points: readonly DemandPoint[],
  itemId: ItemId,
  window: number,
): ForecastBacktest {
  if (!Number.isSafeInteger(window) || window <= 0) {
    throw new RangeError('window must be a positive integer');
  }
  const series = points.filter((point) => point.itemId === itemId).sort((a, b) => a.period - b.period);
  const folds: BacktestFold[] = [];
  for (let index = window; index < series.length; index += 1) {
    const training = series.slice(0, index);
    const actual = series[index]!;
    const generated = movingAverageForecast(training, window, 1);
    const next = generated[0];
    if (!next) continue;
    const forecast: ForecastPoint = { ...next, period: actual.period, itemId };
    folds.push({
      trainThroughPeriod: training.at(-1)!.period,
      actual,
      forecast,
      absoluteError: Math.abs(actual.quantity - forecast.quantity),
    });
  }
  const actualPoints = folds.map((fold) => fold.actual);
  const forecastPoints = folds.map((fold) => fold.forecast);
  return {
    itemId,
    window,
    folds,
    metrics: forecastMetrics(actualPoints, forecastPoints),
  };
}

export function naiveForecast(points: readonly DemandPoint[], itemId: ItemId, period: number): Quantity | null {
  const prior = points
    .filter((point) => point.itemId === itemId && point.period < period)
    .sort((a, b) => b.period - a.period)[0];
  return prior?.quantity ?? null;
}
