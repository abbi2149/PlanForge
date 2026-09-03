import type { Quantity } from '@planforge/model';

export function daysOfSupply(onHand: Quantity, averageDailyDemand: Quantity): number {
  if (averageDailyDemand <= 0) return Number.POSITIVE_INFINITY;
  return onHand / averageDailyDemand;
}

export function coverageBasisPoints(onHand: Quantity, target: Quantity): number {
  if (target <= 0) return 10_000;
  return Math.min(10_000, Math.round((onHand * 10_000) / target));
}
