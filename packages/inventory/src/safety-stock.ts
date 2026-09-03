import type { Quantity } from '@planforge/model';

export function safetyStock(
  averageDailyDemand: Quantity,
  maximumDailyDemand: Quantity,
  averageLeadDays: number,
  maximumLeadDays: number,
): Quantity {
  if (![averageLeadDays, maximumLeadDays].every((value) => Number.isSafeInteger(value) && value >= 0)) {
    throw new RangeError('lead days must be non-negative integers');
  }
  const maximumUsage = maximumDailyDemand * maximumLeadDays;
  const averageUsage = averageDailyDemand * averageLeadDays;
  return Math.max(0, maximumUsage - averageUsage) as Quantity;
}

export function reorderPoint(averageDailyDemand: Quantity, leadDays: number, safety: Quantity): Quantity {
  if (!Number.isSafeInteger(leadDays) || leadDays < 0) throw new RangeError('leadDays must be a non-negative integer');
  return (averageDailyDemand * leadDays + safety) as Quantity;
}

export function economicOrderQuantity(annualDemand: Quantity, setupCostMinor: number, annualHoldingCostMinor: number): Quantity {
  if (setupCostMinor <= 0 || annualHoldingCostMinor <= 0) return 0 as Quantity;
  return Math.ceil(Math.sqrt((2 * annualDemand * setupCostMinor) / annualHoldingCostMinor)) as Quantity;
}
