import type { ItemId, Minute, Quantity } from '@planforge/model';
import type { InventoryDemand, InventoryLot, InventoryReceipt } from './types.js';

export interface InventoryCoverage {
  readonly itemId: ItemId;
  readonly atMinute: Minute;
  readonly availableQuantity: Quantity;
  readonly futureDemandQuantity: Quantity;
  readonly demandRatePerMinute: number;
  readonly coverageMinutes: Minute | null;
}

export function availableQuantityAt(
  itemId: ItemId,
  lots: readonly InventoryLot[],
  receipts: readonly InventoryReceipt[],
  atMinute: Minute,
): Quantity {
  const lotQuantity = lots
    .filter(
      (lot) =>
        lot.itemId === itemId &&
        lot.availableMinute <= atMinute &&
        (lot.expiresMinute === undefined || lot.expiresMinute > atMinute),
    )
    .reduce((sum, lot) => sum + lot.quantity, 0);
  const receiptQuantity = receipts
    .filter((receipt) => receipt.itemId === itemId && receipt.minute <= atMinute)
    .reduce((sum, receipt) => sum + receipt.quantity, 0);
  return (lotQuantity + receiptQuantity) as Quantity;
}

export function inventoryCoverage(
  itemId: ItemId,
  lots: readonly InventoryLot[],
  receipts: readonly InventoryReceipt[],
  demands: readonly InventoryDemand[],
  atMinute: Minute,
  lookaheadMinutes: Minute,
): InventoryCoverage {
  const availableQuantity = availableQuantityAt(itemId, lots, receipts, atMinute);
  const end = atMinute + lookaheadMinutes;
  const futureDemandQuantity = demands
    .filter((demand) => demand.itemId === itemId && demand.minute > atMinute && demand.minute <= end)
    .reduce((sum, demand) => sum + demand.quantity, 0) as Quantity;
  const demandRatePerMinute = lookaheadMinutes <= 0 ? 0 : futureDemandQuantity / lookaheadMinutes;
  return {
    itemId,
    atMinute,
    availableQuantity,
    futureDemandQuantity,
    demandRatePerMinute,
    coverageMinutes:
      demandRatePerMinute === 0 ? null : Math.floor(availableQuantity / demandRatePerMinute) as Minute,
  };
}

export function itemsBelowCoverage(
  itemIds: readonly ItemId[],
  lots: readonly InventoryLot[],
  receipts: readonly InventoryReceipt[],
  demands: readonly InventoryDemand[],
  atMinute: Minute,
  lookaheadMinutes: Minute,
  minimumCoverageMinutes: Minute,
): readonly InventoryCoverage[] {
  return itemIds
    .map((itemId) => inventoryCoverage(itemId, lots, receipts, demands, atMinute, lookaheadMinutes))
    .filter(
      (coverage) =>
        coverage.coverageMinutes !== null && coverage.coverageMinutes < minimumCoverageMinutes,
    )
    .sort(
      (a, b) =>
        (a.coverageMinutes ?? Number.MAX_SAFE_INTEGER) - (b.coverageMinutes ?? Number.MAX_SAFE_INTEGER) ||
        a.itemId.localeCompare(b.itemId),
    );
}
