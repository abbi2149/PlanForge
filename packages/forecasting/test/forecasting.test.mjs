import test from 'node:test';
import assert from 'node:assert/strict';
import { fitLinearTrend, trendForecast, movingAverageBacktest } from '../dist/index.js';

const points = [1, 2, 3, 4, 5].map((quantity, index) => ({ period: index + 1, itemId: 'A', quantity }));

test('linear trend recovers a simple slope', () => {
  const trend = fitLinearTrend(points, 'A');
  assert.equal(trend.slopePerPeriod, 1);
  assert.deepEqual(trendForecast(points, 'A', [6, 7]).map((point) => point.quantity), [6, 7]);
});

test('moving-average backtest emits folds and metrics', () => {
  const result = movingAverageBacktest(points, 'A', 2);
  assert.equal(result.folds.length, 3);
  assert.ok(result.metrics.mae > 0);
});
