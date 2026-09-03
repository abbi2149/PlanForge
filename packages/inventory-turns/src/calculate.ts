import type { MoneyMinor } from '@planforge/model';
import type { InventoryTurnResult, InventoryValuationPoint } from './types.js';

export function inventoryTurns(points: readonly InventoryValuationPoint[], itemId: InventoryTurnResult['itemId']): InventoryTurnResult {
  const relevant = points.filter((point) => point.itemId === itemId).sort((a, b) => a.period - b.period);
  const averageInventoryMinor = relevant.length === 0
    ? 0
    : relevant.reduce((sum, point) => sum + point.inventoryMinor, 0) / relevant.length;
  const costOfGoodsMinor = relevant.reduce((sum, point) => sum + point.costOfGoodsMinor, 0) as MoneyMinor;
  const turns = averageInventoryMinor <= 0 ? 0 : costOfGoodsMinor / averageInventoryMinor;
  return {
    itemId,
    periods: relevant.length,
    averageInventoryMinor,
    costOfGoodsMinor,
    turns,
    daysOnHand: turns <= 0 ? Number.POSITIVE_INFINITY : 365 / turns,
  };
}
