import type { DemandPoint, ForecastMetrics, ForecastPoint } from './types.js';

export function forecastMetrics(actual: readonly DemandPoint[], forecast: readonly ForecastPoint[]): ForecastMetrics {
  const byPeriod = new Map(forecast.map((point) => [point.period, point.quantity]));
  const pairs = actual.flatMap((point) => {
    const predicted = byPeriod.get(point.period);
    return predicted === undefined ? [] : [{ actual: point.quantity as number, predicted: predicted as number }];
  });
  if (pairs.length === 0) return { mae: 0, mse: 0, mapeBasisPoints: 0, bias: 0 };
  let absolute = 0;
  let squared = 0;
  let percentage = 0;
  let percentageCount = 0;
  let bias = 0;
  for (const pair of pairs) {
    const error = pair.predicted - pair.actual;
    absolute += Math.abs(error);
    squared += error * error;
    bias += error;
    if (pair.actual !== 0) {
      percentage += Math.abs(error) / pair.actual;
      percentageCount += 1;
    }
  }
  return {
    mae: absolute / pairs.length,
    mse: squared / pairs.length,
    mapeBasisPoints: percentageCount === 0 ? 0 : Math.round((percentage / percentageCount) * 10_000),
    bias: bias / pairs.length,
  };
}
