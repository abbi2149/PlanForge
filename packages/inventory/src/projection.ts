import type { ItemId, Minute, Quantity } from '@planforge/model';
import type { InventoryDemand, InventoryPosition, InventoryReceipt } from './types.js';

export function projectInventory(
  itemId: ItemId,
  opening: Quantity,
  receipts: readonly InventoryReceipt[],
  demands: readonly InventoryDemand[],
): readonly InventoryPosition[] {
  const events = [
    ...receipts.filter((entry) => entry.itemId === itemId).map((entry) => ({ minute: entry.minute, delta: entry.quantity, kind: 0, reference: entry.reference })),
    ...demands.filter((entry) => entry.itemId === itemId).map((entry) => ({ minute: entry.minute, delta: -entry.quantity, kind: 1, reference: entry.reference })),
  ].sort((a, b) => a.minute - b.minute || a.kind - b.kind || a.reference.localeCompare(b.reference));
  let balance = opening as number;
  const result: InventoryPosition[] = [];
  for (const event of events) {
    balance += event.delta;
    result.push({
      itemId,
      minute: event.minute,
      onHand: Math.max(0, balance) as Quantity,
      shortage: Math.max(0, -balance) as Quantity,
    });
  }
  return result;
}

export function minimumProjectedBalance(positions: readonly InventoryPosition[]): number {
  return positions.reduce((minimum, position) => Math.min(minimum, position.onHand - position.shortage), 0);
}

export function firstShortageMinute(positions: readonly InventoryPosition[]): Minute | null {
  return positions.find((position) => position.shortage > 0)?.minute ?? null;
}
