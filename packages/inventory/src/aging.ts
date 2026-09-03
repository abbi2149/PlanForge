import type { Minute, Quantity } from '@planforge/model';
import type { InventoryLot } from './types.js';

export interface LotAge {
  readonly lotId: InventoryLot['id'];
  readonly itemId: InventoryLot['itemId'];
  readonly quantity: Quantity;
  readonly ageMinutes: Minute;
  readonly remainingShelfLifeMinutes: Minute | null;
  readonly expired: boolean;
}

export function ageInventoryLots(
  lots: readonly InventoryLot[],
  atMinute: Minute,
): readonly LotAge[] {
  return [...lots]
    .sort((a, b) => a.itemId.localeCompare(b.itemId) || a.id.localeCompare(b.id))
    .map((lot) => {
      const remaining = lot.expiresMinute === undefined ? null : Math.max(0, lot.expiresMinute - atMinute);
      return {
        lotId: lot.id,
        itemId: lot.itemId,
        quantity: lot.quantity,
        ageMinutes: Math.max(0, atMinute - lot.availableMinute) as Minute,
        remainingShelfLifeMinutes: remaining === null ? null : (remaining as Minute),
        expired: lot.expiresMinute !== undefined && atMinute >= lot.expiresMinute,
      };
    });
}

export function expiringQuantity(
  lots: readonly InventoryLot[],
  atMinute: Minute,
  withinMinutes: Minute,
): Quantity {
  const cutoff = atMinute + withinMinutes;
  return lots
    .filter(
      (lot) =>
        lot.availableMinute <= atMinute &&
        lot.expiresMinute !== undefined &&
        lot.expiresMinute > atMinute &&
        lot.expiresMinute <= cutoff,
    )
    .reduce((sum, lot) => sum + lot.quantity, 0) as Quantity;
}

export function expiredLotIds(lots: readonly InventoryLot[], atMinute: Minute): readonly string[] {
  return lots
    .filter((lot) => lot.expiresMinute !== undefined && atMinute >= lot.expiresMinute)
    .map((lot) => lot.id)
    .sort();
}
