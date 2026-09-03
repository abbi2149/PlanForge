import type { StoredLot, WarehouseMove } from './types.js';

export function applyWarehouseMove(lots: readonly StoredLot[], move: WarehouseMove): readonly StoredLot[] | null {
  const source = lots.find((lot) => lot.lotId === move.lotId && lot.locationId === move.fromLocationId);
  if (!source || source.quantity < move.quantity || move.quantity <= 0) return null;
  const remaining = source.quantity - move.quantity;
  const next = lots.filter((lot) => lot !== source);
  if (remaining > 0) next.push({ ...source, quantity: remaining as StoredLot['quantity'] });
  const destination = next.find((lot) => lot.lotId === move.lotId && lot.locationId === move.toLocationId);
  if (destination) {
    const without = next.filter((lot) => lot !== destination);
    without.push({ ...destination, quantity: (destination.quantity + move.quantity) as StoredLot['quantity'] });
    return without.sort((a, b) => a.locationId.localeCompare(b.locationId) || a.lotId.localeCompare(b.lotId));
  }
  next.push({ ...source, locationId: move.toLocationId, quantity: move.quantity, storedMinute: move.minute });
  return next.sort((a, b) => a.locationId.localeCompare(b.locationId) || a.lotId.localeCompare(b.lotId));
}
