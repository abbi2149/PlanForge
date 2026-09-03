import type { InventoryTurnResult } from './types.js';

export function inventoryReductionOpportunity(
  result: InventoryTurnResult,
  targetTurns: number,
): number {
  if (targetTurns <= 0 || result.costOfGoodsMinor <= 0) return 0;
  const targetAverage = result.costOfGoodsMinor / targetTurns;
  return Math.max(0, result.averageInventoryMinor - targetAverage);
}
