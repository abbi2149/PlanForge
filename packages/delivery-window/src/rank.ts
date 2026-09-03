import type { DeliveryWindowResult } from './types.js';

export function deliveryWindowExceptions(results: readonly DeliveryWindowResult[]): readonly DeliveryWindowResult[] {
  return results.filter((result) => !result.withinWindow).sort((a, b) => b.lateMinutes - a.lateMinutes || b.earlyMinutes - a.earlyMinutes || a.id.localeCompare(b.id));
}

export function deliveryWindowHitRateBasisPoints(results: readonly DeliveryWindowResult[]): number {
  if (results.length === 0) return 0;
  return Math.round((results.filter((result) => result.withinWindow).length * 10_000) / results.length);
}
